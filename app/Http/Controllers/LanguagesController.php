<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Language;
use DB;
use App\Setting;

class LanguagesController extends Controller
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
        return view('languages')->with('active_menu', 'languages');
    }

    public function languageBooks($id){
      $language = Language::find($id);
      return view('books')->with('active_menu', 'languages')
                          ->with('entity_url', 'getLanguageBooks')
                          ->with('entity_id', $id)
                          ->with('entity_name', $language->language )
                          ->with('entity_image', '');
    }


    public function getLanguageBooks($id){
      $language = Language::find($id);

      if(!isset($language) || $language == null) {
        return response()->json(Array('success' => false, 'error' => 'Language '.$id.' not found'));
      }

      $data = [];
      foreach ($language->books as $book) {
        $data[] = ['title' => $book->title,
                    'cover' => $book->getCover(),
                    'id' => $book->id,
                    'authors' => $book->getAuthorsLinks(),
                    'vote' => intval($book->vote,10)];
      }

      return response()->json(Array('success' => true, 'value' => $data));
    }

    public function getLanguagesValueLabel(){
      $languages = Language::orderBy('language')->get();

      foreach ($languages as $language) {
        $data[] = Array('value' => $language->id, 'label' => $language->language);
      }

      return response()->json($data);
    }

    public function getLanguages(){
      $settings = Setting::first();

      $sort_params = (isset($_GET['sort']) && $_GET['sort'] != '')?$_GET['sort']:'bcount|desc';
      $sort_fields = explode('|', $sort_params);

      if($sort_fields[0] == 'bcount'){
        $languages = DB::table('languages')->selectRaw('languages.*, COUNT(books.id) as bcount')
                                    ->leftJoin('book_languages', 'languages.id', '=', 'book_languages.language_id')
                                    ->leftJoin('books', 'books.id', '=', 'book_languages.book_id')
                                    ->groupBy('languages.id')
                                    ->orderBy($sort_fields[0], $sort_fields[1])
                                    ->orderBy('languages.language', 'asc')->paginate($settings->languages_pagination);

      } else {
        $languages = DB::table('languages')->selectRaw('languages.*, COUNT(books.id) as bcount')
                                    ->leftJoin('book_languages', 'languages.id', '=', 'book_languages.language_id')
                                    ->leftJoin('books', 'books.id', '=', 'book_languages.book_id')
                                    ->groupBy('languages.id')
                                    ->orderBy($sort_fields[0], $sort_fields[1])->paginate($settings->languages_pagination);
      }

      return $languages;
    }

    public function setLanguage(Request $request){
      if(isset($request->id) && $request->id != null && $request->id != ''){
        $language = Language::find($request->id);

      } else {
        $language = new Language();
        $language->setUUID();
      }

      $language->code = strtoupper($request->code);
      $language->language = $request->language;
      $language->save();
    }

    public function deleteLanguage(Request $request){
      Language::find($request->id)->delete();
    }

}
