<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use DB;
use App\Publisher;
use App\Setting;

class PublishersController extends Controller
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
        return view('publishers')->with('active_menu', 'publishers');
    }

    public function publisherBooks($id){
      $publisher = Publisher::find($id);
      return view('books')->with('active_menu', 'publishers')
                          ->with('entity_url', 'getPublisherBooks')
                          ->with('entity_id', $id)
                          ->with('entity_name', $publisher->name )
                          ->with('entity_image', '');
    }

    public function getPublisherBooks($id){
      $publisher = Publisher::find($id);

      if(!isset($publisher) || $publisher == null) {
        return response()->json(Array('success' => false, 'error' => 'Publisher '.$id.' not found'));
      }

      $data = [];
      foreach ($publisher->books as $book) {
        $data[] = ['title' => $book->title,
                    'cover' => $book->getCover(),
                    'id' => $book->id,
                    'authors' => $book->getAuthorsLinks(),
                    'vote' => intval($book->vote,10)];
      }

      return response()->json(Array('success' => true, 'value' => $data));
    }


    public function getAllPublishers(){
      return Publisher::orderBy('name')->get();
    }

    public function getPublishersValueLabel(){
      $publishers = Publisher::orderBy('name')->get();

      foreach ($publishers as $publisher) {
        $data[] = Array('value' => $publisher->id, 'label' => $publisher->name);
      }

      return response()->json($data);
    }

    public function getPublishers(){
      $settings = Setting::first();
      $request = request();

      $sort_params = (isset($_GET['sort']) && $_GET['sort'] != '')?$_GET['sort']:'bcount|desc';
      $sort_fields = explode('|', $sort_params);

      $filter = "%%";
      if ($request->exists('filter')) {
        $filter = "%$request->filter%";
      }

      if($sort_fields[0] == 'bcount'){
        $publishers = DB::table('publishers')->selectRaw('publishers.*, COUNT(books.id) as bcount, nationalities.code as nation')
                                        ->leftJoin('books', 'books.publisher_id', '=', 'publishers.id')
                                        ->leftJoin('nationalities', 'nationalities.id', '=', 'publishers.nationality_id')
                                        ->where('publishers.name', 'like', $filter)
                                        ->orWhere('publishers.website', 'like', $filter)
                                        ->orWhere('publishers.email', 'like', $filter)
                                        ->groupBy('publishers.id')->groupBy('nationalities.code')
                                        ->orderBy($sort_fields[0], $sort_fields[1])
                                        ->orderBy('publishers.name', 'asc')->paginate($settings->publishers_pagination);

      } else {
        $publishers = DB::table('publishers')->selectRaw('publishers.*, COUNT(books.id) as bcount, nationalities.code as nation')
                                        ->leftJoin('books', 'books.publisher_id', '=', 'publishers.id')
                                        ->leftJoin('nationalities', 'nationalities.id', '=', 'publishers.nationality_id')
                                        ->where('publishers.name', 'like', $filter)
                                        ->orWhere('publishers.website', 'like', $filter)
                                        ->orWhere('publishers.email', 'like', $filter)
                                        ->groupBy('publishers.id')->groupBy('nationalities.code')
                                        ->orderBy($sort_fields[0], $sort_fields[1])->paginate($settings->publishers_pagination);

      }

      return $publishers;
    }

    public function setPublisher(Request $request){
      if(isset($request->id) && $request->id != null && $request->id != ''){
        $publisher = Publisher::find($request->id);

      } else {
        $publisher = new Publisher();
        $publisher->setUUID();
      }

      $publisher->name = $request->name;
      $publisher->website = $request->website;
      $publisher->email = $request->email;
      $publisher->nationality_id = $request->nationality_id;
      $publisher->save();

      return response()->json(Array('success' => true, 'value' => $publisher->id));
    }

    public function deletePublisher(Request $request){
      Publisher::find($request->id)->delete();
    }
}
