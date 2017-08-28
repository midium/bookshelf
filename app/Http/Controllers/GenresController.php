<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use DB;
use App\Genre;
use App\Setting;

class GenresController extends Controller
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
        return view('genres')->with('active_menu', 'genres');
    }

    public function genreBooks($id){
      $genre = Genre::find($id);
      return view('books')->with('active_menu', 'genres')
                          ->with('entity_url', 'getGenreBooks')
                          ->with('entity_id', $id)
                          ->with('entity_name', $genre->name )
                          ->with('entity_image', '');
    }

    public function getGenreBooks($id){
      $genre = Genre::find($id);

      if(!isset($genre) || $genre == null) {
        return response()->json(Array('success' => false, 'error' => 'Genre '.$id.' not found'));
      }

      $data = [];
      foreach ($genre->books as $book) {
        $data[] = ['title' => $book->title,
                    'cover' => $book->getCover(),
                    'id' => $book->id,
                    'authors' => $book->getAuthorsLinks(),
                    'vote' => intval($book->vote,10)];
      }

      return response()->json(Array('success' => true, 'value' => $data));
    }

    public function getGenresValueLabel(){
      $genres = Genre::orderBy('name')->get();

      foreach ($genres as $genre) {
        $data[] = Array('value' => $genre->id, 'label' => $genre->name);
      }

      return response()->json($data);
    }

    public function getGenres(){
      $settings = Setting::first();
      $request = request();

      $sort_params = (isset($_GET['sort']) && $_GET['sort'] != '')?$_GET['sort']:'bcount|desc';
      $sort_fields = explode('|', $sort_params);

      $filter = "%%";
      if ($request->exists('filter')) {
        $filter = "%$request->filter%";
      }

      if($sort_fields[0] == 'bcount'){
        $genres = DB::table('genres')->selectRaw('genres.*, COUNT(books.id) as bcount')
                                    ->leftJoin('book_genres', 'genres.id', '=', 'book_genres.genre_id')
                                    ->leftJoin('books', 'books.id', '=', 'book_genres.book_id')
                                    ->where('genres.name', 'like', $filter)
                                    ->groupBy('genres.id')
                                    ->orderBy($sort_fields[0], $sort_fields[1])
                                    ->orderBy('genres.name', 'asc')->paginate($settings->genres_pagination);

      } else {
        $genres = DB::table('genres')->selectRaw('genres.*, COUNT(books.id) as bcount')
                                    ->leftJoin('book_genres', 'genres.id', '=', 'book_genres.genre_id')
                                    ->leftJoin('books', 'books.id', '=', 'book_genres.book_id')
                                    ->where('genres.name', 'like', $filter)
                                    ->groupBy('genres.id')
                                    ->orderBy($sort_fields[0], $sort_fields[1])->paginate($settings->genres_pagination);

      }

      return $genres;
    }

    public function setGenre(Request $request){
      if(isset($request->id) && $request->id != null && $request->id != ''){
        $genre = Genre::find($request->id);

      } else {
        $genre = new Genre();
        $genre->setUUID();
      }

      $genre->name = $request->name;
      $genre->save();
    }

    public function deleteGenre(Request $request){
      Genre::find($request->id)->delete();
    }

}
