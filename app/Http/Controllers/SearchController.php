<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use DB;
use Goutte;
use App\Language;
use App\Author;
use App\Publisher;

class SearchController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('search')->with('active_menu', 'search');
    }

    public function isbnSearch($isbn)
    {
      if(trim($isbn) == '' || $isbn == null){
        return response()->json(Array('success' => false, 'error' => 'Invalid ISBN provided.'));
      } else {
        $crawler = Goutte::request('GET', 'http://www.bookfinder.com/search/?isbn='.$isbn.'&mode=isbn&st=sr&ac=qr');

        $data['title'] = '';
        $data['author'] = '';
        $data['publisher'] = '';
        $data['year'] = '';
        $data['language'] = '';
        $data['description'] = '';
        $data['cover'] = '';
        $data['isbn'] = $isbn;

        if($crawler->filter('span[itemprop="name"]')->count() > 0){
          $data['title'] = $crawler->filter('span[itemprop="name"]')->first()->text();
        }
        if($crawler->filter('span[itemprop="author"]')->count() > 0){
          $data['author'] = $crawler->filter('span[itemprop="author"]')->first()->text();
        }
        if($crawler->filter('span[itemprop="publisher"]')->count() > 0){
          $publisher = $crawler->filter('span[itemprop="publisher"]')->first()->text();
          $publisher = explode(',', $publisher);

          $data['publisher'] = trim($publisher[0]);
          $data['year'] = (isset($publisher[1]))?trim($publisher[1]):'';
        }
        if($crawler->filter('span[itemprop="inLanguage"]')->count() > 0){
          $data['language'] = $crawler->filter('span[itemprop="inLanguage"]')->first()->text();
        }
        if($crawler->filter('img[itemprop="image"]')->count() > 0 && $crawler->filter('img[itemprop="image"]')->first()->attr('src') != ''){
          $data['cover'] = urlToBase64Image($crawler->filter('img[itemprop="image"]')->first()->attr('src'));
        }
        if($crawler->filter('div[itemprop="description"]')->count() > 0){
          $data['description'] = $crawler->filter('div[itemprop="description"]')->first()->text();
        }

        // Searching existing elements like author, publisher or language
        $existing_items['publishers'] = '';
        $existing_items['authors'] = '';
        $existing_items['languages'] = '';

        if(isset($data) && isset($data['publisher']) && $data['publisher'] != '' && $data['publisher'] != null){
          $publisher = DB::table('publishers')->whereRaw(" MATCH (publishers.name) AGAINST ('".$data['publisher']."' IN NATURAL LANGUAGE MODE)")->get();

          $available_publisher = [];
          foreach ($publisher as $value) {
            $available_publisher[] = Array('value' => $value->id, 'label' => $value->name);
          }
          $existing_items['publishers'] = $available_publisher;
        }

        if(isset($data) && isset($data['author']) && $data['author'] != '' && $data['author'] != null){
          $author = DB::table('authors')->whereRaw(" MATCH (authors.name) AGAINST ('".$data['author']."' IN NATURAL LANGUAGE MODE)")->get();

          $available_author = [];
          foreach ($author as $value) {
            $available_author[] = Array('value' => $value->id, 'label' => $value->name);
          }
          $existing_items['authors'] = $available_author;
        }

        if(isset($data) && isset($data['language']) && $data['language'] != '' && $data['language'] != null){
          $language = DB::table('languages')->whereRaw(" MATCH (languages.language) AGAINST ('".$data['language']."' IN NATURAL LANGUAGE MODE)")->get();

          $available_language = [];
          foreach ($language as $value) {
            $available_language[] = Array('value' => $value->id, 'label' => $value->language);
          }
          $existing_items['languages'] = $available_language;
        }

        return response()->json(Array('success' => true, 'value' => $data, 'correspondences' => $existing_items));
      }
    }

}
