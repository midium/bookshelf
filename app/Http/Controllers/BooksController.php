<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Book;
use App\Read;
use App\Publisher;
use App\Author;
use App\Language;
use App\Collection;
use Storage;
use DB;
use Excel;
use Bugsnag;

class BooksController extends Controller
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

      if(isset($_GET['letter']) && $_GET['letter'] != null && $_GET['letter'] != ''){
        $letter = $_GET['letter'];
      } else {
        $letter = '';
      }

      return view('shelf')->with('active_menu', 'shelf')
                          ->with('letter', $letter);
    }

    public function nowReading(){
      return view('reading')->with('active_menu', 'reading');
    }

    public function bookDetails($id){
      $book = Book::find($id);
      return view('book.details')->with('book_id', $id)
                                 ->with('active_menu', 'shelf')
                                 ->with('book_title', $book->title);
    }

    public function getBooks(){
      $books = Book::orderBy('title')->get();

      $response = [];

      foreach ($books as $book) {
        $response[] = ['id' => $book->id,
                       'title' => $book->title,
                       'description' => $book->description,
                       'vote' => $book->vote,
                       'cover' => $book->getCover(),
                       'authors' => $book->getAuthorsLinks(),
                       'genres' => $book->getGenresLinks(),
                       'isRead' => $book->reads()->count()];
      }

      return response()->json($response);
    }

    public function getBooksValueLabel(){
      $books = Book::orderBy('title')->get();

      foreach ($books as $book) {
        $data[] = Array('value' =>  intval($book->id,10), 'label' => $book->title);
      }

      return response()->json($data);
    }

    public function getReadStatuses(){
      return response()->json(getAllReadStatuses());
    }

    public function getBookReads($id) {
      $book = Book::find($id);

      $data = [ 'id' => $book->id,
                'title' => $book->title];

      foreach ($book->reads as $read) {
        $data['reads'][] = ['id' => $read->id,
                            'start' => $read->start_date,
                            'end' => $read->end_date,
                            'status' => ['value' => intval($read->read_status_id,10),
                                         'label' => getStatusFromId($read->read_status_id)]];
      }

      return response()->json($data);

    }

    public function getBookDetails($id){
      $book = Book::find($id);

      $data = [ 'id' => $book->id,
                'title' => $book->title,
                'original_title' => $book->original_title,
                'pages' => $book->pages,
                'year' => $book->year,
                'isbn' => $book->isbn,
                'vote' => $book->vote,
                'description' => $book->description,
                'publisher' => ($book->publisher_id == 0)?[]:['id' => intval($book->publisher_id,10), 'name' => $book->publisher->name],
                'cover' => $book->getCover(),
                'authors' => $book->getAuthorsLinks(),
                'genres' => $book->getGenresLinks(),
                'collections' => $book->getCollectionsLinks(),
                'languages' => $book->getLanguagesLinks()];

      return response()->json($data);

    }

    public function getReadingsBooks(){
      $books = Book::whereHas('reads', function ($query) {
        $query->where('read_status_id', '=', 1);
      })->get();

      foreach ($books as $book) {
        $response[] = ['id' => $book->id,
                       'title' => $book->title,
                       'description' => $book->description,
                       'vote' => $book->vote,
                       'cover' => $book->getCover(),
                       'authors' => $book->getAuthorsLinks(),
                       'reading_since' => substr($book->reads()->where('read_status_id', '=', 1)->first()->start_date,0,10),
                       'time_lapsed' => humanTiming(strtotime($book->reads()->where('read_status_id', '=', 1)->first()->start_date)),
                       'genres' => $book->getGenresLinks()];
      }

      return response()->json($response);
    }

    public function bookReads($id) {
      $book = Book::find($id);
      return view('book.reads')->with('book_id', $id)
                               ->with('active_menu', 'shelf')
                               ->with('book_title', $book->title);
    }

    public function getBook($id){
      $book = Book::find($id);

      $data = [ 'id' => $book->id,
                'title' => $book->title,
                'original_title' => $book->original_title,
                'pages' => $book->pages,
                'year' => $book->year,
                'isbn' => $book->isbn,
                'vote' => $book->vote,
                'description' => $book->description,
                'publisher_id' => ($book->publisher_id == 0)?'': intval($book->publisher_id,10),
                'cover' => $book->getCover()];

      foreach ($book->authors as $author) {
        $data['authors'][] = $author->id;
      }
      foreach ($book->genres as $genre) {
        $data['genres'][] = $genre->id;
      }
      foreach ($book->collections as $collection) {
        $data['collections'][] = $collection->id;
      }
      foreach ($book->languages as $language) {
        $data['languages'][] = $language->id;
      }

      return response()->json($data);

    }

    public function setBook(Request $request){
      //Checking if there is something to add (coming from online search)
      $publisher_id = is_array($request->publisher_id) ? $request->publisher_id[0] : $request->publisher_id;
      if(isset($request->is_new_publisher) && $request->is_new_publisher == true){
        $publisher = new Publisher();
        $publisher->setUUID();
        $publisher->name = is_array($request->publisher_id) ? $request->publisher_id[0] : $request->publisher_id;
        $publisher->email = '';
        $publisher->website = '';
        $publisher->save();
        $publisher_id = $publisher->id;
      }

      if(isset($request->id) && $request->id != null && $request->id != ''){
        $book = Book::find($request->id);

      } else {
        $book = new Book();
        $book->setUUID();

      }

      // Filling up book details
      $book->title = $request->title;
      $book->original_title = $request->original_title;
      $book->pages = $request->pages;
      $book->year = $request->year;
      $book->isbn = $request->isbn;
      $book->vote = $request->vote;
      $book->description = $request->description;
      $book->publisher_id = $publisher_id;

      $book->save();

      // Pushing book authors
      $book->authors()->detach();
      if(isset($request->is_new_author) && $request->is_new_author == true){
        $author = new Author();
        $author->setUUID();
        $author->name = is_array($request->authors) ? $request->authors[0] : $request->authors;
        $author->save();

        $book->authors()->attach($author->id, ['uuid' => generate_uuid()]);

      } else {
        if($request->authors != ''){
          foreach ($request->authors as $author) {
            $book->authors()->attach($author, ['uuid' => generate_uuid()]);
          }
        }

      }

      // Pushing book genres
      $book->genres()->detach();
      if($request->genres != ''){
        foreach ($request->genres as $genre) {
          $book->genres()->attach($genre, ['uuid' => generate_uuid()]);
        }
      }

      // Pushing book languages
      $book->languages()->detach();
      if(isset($request->is_new_language) && $request->is_new_language == true){
        $language = new Language();
        $language->setUUID();
        $language->language = is_array($request->languages) ? $request->languages[0] : $request->languages;
        $language->save();

        $book->languages()->attach($language->id, ['uuid' => generate_uuid()]);

      } else {
        if($request->languages != ''){
          foreach ($request->languages as $language) {
            $book->languages()->attach($language, ['uuid' => generate_uuid()]);
          }
        }

      }

      // Pushing book collections
      $book->collections()->detach();
      if($request->collections != ''){
        foreach ($request->collections as $collection) {
          $book->collections()->attach($collection, ['uuid' => generate_uuid()]);
        }
      }

      //Now I upload the picture if available
      if (isset($request->cover) && $request->cover != null && $request->cover != '' && strpos($request->cover, 'http://') === false) {
        // N.B.: Local storage path has been overrided on configuration
        Storage::disk('local')->put('/covers/'.$book->id.'.png',  decodeBase64ToJpeg($request->cover));

      } elseif(!isset($request->cover) || $request->cover == null || $request->cover == '' ) {
        if (strpos($request->cover, 'http://') === false) {
          if(Storage::disk('local')->exists('/covers/'.$book->id.'.png'))
            Storage::disk('local')->delete('/covers/'.$book->id.'.png');
        }

      }
    }

    public function setBookRead(Request $request){
      if(isset($request->id) && $request->id != null && $request->id != ''){
        $book_read = Read::find($request->id);

        // Making sure to not duplicate
        $book_read->books()->detach($request->book_id);

      } else {
        $book_read = new Read();
        $book_read->setUUID();
      }

      // Filling up book details
      $book_read->read_status_id = (isset($request->status) && !empty($request->status))?$request->status[0]:1;
      $book_read->start_date = ($request->start != null)?$request->start:'';
      $book_read->end_date = ($request->end != null)?$request->end:'';

      $book_read->save();

      // Re attach book to this read
      $book_read->books()->attach($request->book_id, ['uuid' => generate_uuid()]);

      // Returning the read id
      return response(array('success' => true, 'value' => $book_read->id));
    }

    public function deleteBookRead(Request $request){
      // Removing all links between this read and any links
      $read = Read::find($request->id);
      if(isset($read) && $read != null) {
        $read->books()->detach($request->id);

        // Removing the book
        $read->delete();

      }

    }

    public function deleteBook(Request $request){
      // Removing all links between this book and any links
      $book = Book::find($request->id);
      if(isset($book) && $book != null) {
        $book->languages()->detach();
        $book->authors()->detach();
        $book->genres()->detach();
        $book->collections()->detach();
        $book->reads()->detach();

        // Removing book cover from local Storage
        if(Storage::disk('local')->exists('/covers/'.$request->id.'.png'))
          Storage::disk('local')->delete('/covers/'.$request->id.'.png');

        // Removing the book
        $book->delete();

      }

    }

    public function exportBookShelf(){
      $result = DB::select("SELECT
                                b.*,
                                p.name AS publisher,
                                GROUP_CONCAT(DISTINCT a.`name` SEPARATOR ', ') AS `authors`,
                                GROUP_CONCAT(DISTINCT g.`name` SEPARATOR ', ') AS `genres`,
                                GROUP_CONCAT(DISTINCT c.`name` SEPARATOR ', ') AS `collections`
                              FROM
                                books b
                                LEFT JOIN publishers p
                                  ON b.`publisher_id` = p.`id`
                                LEFT JOIN book_authors ba
                                  ON b.id = ba.`book_id`
                                LEFT JOIN `authors` a
                                  ON ba.`author_id` = a.`id`
                                LEFT JOIN book_genres bg
                                  ON b.id = bg.`book_id`
                                LEFT JOIN genres g
                                  ON g.id = bg.`genre_id`
                                LEFT JOIN book_collections bc
                                  ON b.id = bc.`book_id`
                                LEFT JOIN collections c
                                  ON c.id = bc.`collection_id`
                              GROUP BY b.id
                              ORDER BY b.title ;");

        Excel::create('bookshelf', function($excel) use ($result) {

            $excel->sheet('BookShelf', function($sheet) use ($result) {
                $sheet->loadView('excel.export')->with('data', $result);
            });

        })->download('xlsx');

    }
}
