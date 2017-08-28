<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Author;
use Storage;

class AuthorsController extends Controller
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
        $is_search = false;
      } else {
        $letter = '';
        $is_search = false;
      }

      return view('authors')->with('active_menu', 'authors')
                            ->with('letter', $letter)
                            ->with('is_search', $is_search);
    }

    public function authorBooks($id){
      $author = Author::find($id);
      return view('books')->with('active_menu', 'authors')
                          ->with('entity_url', 'getAuthorBooks')
                          ->with('entity_id', $id)
                          ->with('entity_name', $author->name )
                          ->with('entity_image', $author->getImage());
    }

    public function getAuthorsValueLabel(){
      $authors = Author::orderBy('name')->get();

      foreach ($authors as $author) {
        $data[] = Array('value' => $author->id, 'label' => $author->name);
      }

      return response()->json($data);
    }

    public function getAuthors(){

      $authors = Author::orderBy('name')->get();

      $response = [];

      foreach ($authors as $author) {
        $response[] = ['name' => $author->name,
                       'website' => $author->website,
                       'email' => $author->email,
                       'avatar' => $author->getImage(),
                       'birth' => (isset($author->birth) && $author->birth != null)?(($author->birth->format('Y-m-d')=='-0001-11-30')?'':$author->birth->format('Y-m-d')):'',
                       'death' => (isset($author->death) && $author->death != null)?(($author->death->format('Y-m-d')=='-0001-11-30')?'':$author->death->format('Y-m-d')):'',
                       'bcount' => $author->books->count(),
                       'id' => $author->id,
                       'nat' => ($author->nationality)?$author->nationality->code:''];
      }

      return response()->json($response);

    }

    public function deleteAuthor(Request $request){
      // Removing all links between this author and any book on shelf
      Author::find($request->id)->books()->detach();

      // Removing author avatar from local Storage
      if(Storage::disk('local')->exists('/authors/'.$request->id.'.png'))
        Storage::disk('local')->delete('/authors/'.$request->id.'.png');

      // Removing the author
      Author::find($request->id)->delete();
    }

    public function getAuthor($id){
      $author = Author::find($id);

      $data = ['name' => $author->name,
               'website' => $author->website,
               'id' => $author->id,
               'email' => $author->email,
               'nationality_id' => (isset($author->nationality) &&  $author->nationality != null)?$author->nationality->id:'',
               'avatar' => $author->getImage(),
               'birth' => (isset($author->birth) && $author->birth != null)?(($author->birth->format('Y-m-d')=='-0001-11-30')?'':$author->birth->format('Y-m-d')):'',
               'death' => (isset($author->death) && $author->death != null)?(($author->death->format('Y-m-d')=='-0001-11-30')?'':$author->death->format('Y-m-d')):''];

      return response()->json($data);

    }

    public function getAuthorBooks($id){
      $author = Author::find($id);

      if(!isset($author) || $author == null) {
        return response()->json(Array('success' => false, 'error' => 'Author '.$id.' not found'));
      }

      $data = [];
      foreach ($author->books as $book) {
        $data[] = ['title' => $book->title,
                    'cover' => $book->getCover(),
                    'id' => $book->id,
                    'authors' => $book->getAuthorsLinks(),
                    'vote' => intval($book->vote,10)];
      }

      return response()->json(Array('success' => true, 'value' => $data));
    }

    public function setAuthor(Request $request){

      if(isset($request->id) && $request->id != null && $request->id != ''){
        $author = Author::find($request->id);

      } else {
        $author = new Author();
        $author->setUUID();

      }

      $author->name = $request->name;
      $author->website = $request->website;
      $author->email = $request->email;
      $author->birth = $request->birth;
      $author->death = $request->death;
      $author->nationality_id = $request->nationality_id;
      $author->save();

      //Now I upload the picture if available
      if (isset($request->avatar) && $request->avatar != null && $request->avatar != '' && strpos($request->avatar, 'http://') === false) {
        // N.B.: Local storage path has been overrided on configuration
				Storage::disk('local')->put('/authors/'.$author->id.'.png',  decodeBase64ToJpeg($request->avatar));

      } elseif(!isset($request->avatar) || $request->avatar == null || $request->avatar == '') {
        if (strpos($request->avatar, 'http://') === false) {
          if(Storage::disk('local')->exists('/authors/'.$author->id.'.png'))
            Storage::disk('local')->delete('/authors/'.$author->id.'.png');
          }

      }

    }

    public function getAuthorProfile($id){
      $author = Author::find($id);

      $data = ['name' => $author->name,
                 'website' => $author->website,
                 'email' => $author->email,
                 'nationality' => $author->nationality->code,
                 'avatar' => $author->getImage(),
                 'birth' => (isset($author->birth) && $author->birth != null)?(($author->birth->format('Y-m-d')=='-0001-11-30')?'':$author->birth->format('Y-m-d')):'',
                 'death' => (isset($author->death) && $author->death != null)?(($author->death->format('Y-m-d')=='-0001-11-30')?'':$author->death->format('Y-m-d')):'',
                 'books' => array()];

      foreach ($author->books as $book) {
        $data['books'][] = ['title' => $book->title,
                            'cover' => $book->getCover(),
                            'id' => $book->id,
                            'vote' => intval($book->vote,10)];
      }

      return response()->json($data);
    }

    public function authorProfile($id){
      $author = Author::find($id);
      return view('authors.profile')->with('active_menu', 'authors')
                                    ->with('author_id', $id)
                                    ->with('author_name', $author->name );
    }
}
