<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Book;
use App\Collection;

class CollectionsController extends Controller
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
      return view('collections')->with('active_menu', 'collections');
    }

    public function showCollection($id){
      $collection = Collection::find($id);
      return view('collections.collection')->with('active_menu', 'collections')
                                           ->with('collection_id', $id)
                                           ->with('collection', $collection->name);
    }

    public function getCollectionsValueLabel(){
      $collections = Collection::orderBy('name')->get();

      foreach ($collections as $collection) {
        $data[] = Array('value' => $collection->id, 'label' => $collection->name);
      }

      return response()->json($data);
    }

    public function getCollections(){
      $collections = Collection::all();

      $data = [];
      foreach ($collections as $collection) {
        $item = Array('id' => $collection->id, 'name' => $collection->name, 'books' => []);

        foreach ($collection->books as $book) {
          $item['books'][] = $book->getCover();
        }

        $data[] = $item;

      }
      return response()->json($data);
    }

    public function getCollectionDetails($id){
      $collection = Collection::find($id);

      if(!isset($collection) || $collection == null){
        return response()->json(array('success' => false, 'error' => 'Collection not found!'));
      }

      $data['success'] = true;
      $data['value'] = array('id' => $id, 'name' => $collection->name);

      foreach ($collection->books as $book) {
        $data['value']['books'][] = ['id' => $book->id,
                       'title' => $book->title,
                       'description' => $book->description,
                       'authors' => $book->getAuthorsLinks(),
                       'vote' => $book->vote,
                       'cover' => $book->getCover()];

        foreach ($book->authors as $author) {
          if(!isset($data['value']['authors']) || empty($data['value']['authors'])){
            $data['value']['authors'][$author->id]['name'] = $author->name;
            $data['value']['authors'][$author->id]['count'] = 1;
          } else {
            if(!array_key_exists($author->id, $data['value']['authors'])) {
              $data['value']['authors'][$author->id]['name'] = $author->name;
              $data['value']['authors'][$author->id]['count'] = 1;
            } else {
              $data['value']['authors'][$author->id]['count']++;
            }
          }
        }

        foreach ($book->genres as $genre) {
          if(!isset($data['value']['genres']) || empty($data['value']['genres'])){
            $data['value']['genres'][$genre->id]['name'] = $genre->name;
            $data['value']['genres'][$genre->id]['count'] = 1;
          } else {
            if(!array_key_exists($genre->id, $data['value']['genres'])) {
              $data['value']['genres'][$genre->id]['name'] = $genre->name;
              $data['value']['genres'][$genre->id]['count'] = 1;
            } else {
              $data['value']['genres'][$genre->id]['count']++;
            }
          }
        }

        if($book->publisher != null){
          if(!isset($data['value']['publishers']) || empty($data['value']['publishers'])){
            $data['value']['publishers'][$book->publisher->id]['name'] = $book->publisher->name;
            $data['value']['publishers'][$book->publisher->id]['count'] = 1;
          } else {
            if(!array_key_exists($book->publisher->id, $data['value']['publishers'])) {
              $data['value']['publishers'][$book->publisher->id]['name'] = $book->publisher->name;
              $data['value']['publishers'][$book->publisher->id]['count'] = 1;
            } else {
              $data['value']['publishers'][$book->publisher->id]['count']++;
            }
          }
        }

        foreach ($book->languages as $language) {
          if(!isset($data['value']['languages']) || empty($data['value']['languages'])){
            $data['value']['languages'][$language->id]['name'] = $language->language;
            $data['value']['languages'][$language->id]['count'] = 1;
          } else {
            if(!array_key_exists($language->id, $data['value']['languages'])) {
              $data['value']['languages'][$language->id]['name'] = $language->language;
              $data['value']['languages'][$language->id]['count'] = 1;
            } else {
              $data['value']['languages'][$language->id]['count']++;
            }
          }
        }

      }

      $data['value']['authors'] = ArrayMultiSort($data['value']['authors'], 'count', 'DESC', 'name', 'ASC');
      $data['value']['genres'] = ArrayMultiSort($data['value']['genres'], 'count', 'DESC', 'name', 'ASC');
      $data['value']['publishers'] = ArrayMultiSort($data['value']['publishers'], 'count', 'DESC', 'name', 'ASC');
      $data['value']['languages'] = ArrayMultiSort($data['value']['languages'], 'count', 'DESC', 'name', 'ASC');

      return response()->json($data);
    }

    public function getCollection($id){
      $collection = Collection::find($id);

      $data = ['name' => $collection->name,
               'id' => $collection->id,
               'books' => []];

      foreach ($collection->books as $book) {
        $data['books'][] = Array('value' => $book->id, 'label' => $book->title);
      }

      return response()->json($data);

    }

    public function setCollection(Request $request){
      if(isset($request->id) && $request->id != null && $request->id != ''){
        $collection = Collection::find($request->id);

      } else {
        $collection = new Collection();
        $collection->setUUID();

      }

      // Creating collection
      $collection->name = $request->name;
      $collection->save();

      // Attaching books to the collection, but first detaching any previous connection to any books
      $collection->books()->detach();
      if(isset($request->books) && $request->books != null && $request->books != '' && !empty($request->books)){
        foreach ($request->books as $book_id) {
          $collection->books()->attach($book_id, ['uuid' => generate_uuid()]);
        }
      }
    }

    public function deleteCollection(Request $request){
      // Removing all links between this collection and any book on shelf
      Collection::find($request->id)->books()->detach();

      // Removing the collection
      Collection::find($request->id)->delete();
    }

}
