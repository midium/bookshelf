<?php

namespace App;

use App\CustomModel;
use App\Publisher;
use App\Author;
use App\Genres;
use App\Collection;
use App\Languages;
use App\Read;
use Storage;
use Response;
use Image;

class Book extends CustomModel
{
    protected $table = 'books';
    protected $fillable = ['title', 'original_title', 'pages', 'year', 'isbn', 'vote', 'description', 'publisher_id'];

    public function publisher(){
      return $this->belongsTo('App\Publisher');
    }

    public function authors(){
      return $this->belongsToMany('App\Author', 'book_authors', 'book_id');
    }

    public function genres(){
      return $this->belongsToMany('App\Genre', 'book_genres');
    }

    public function reads(){
      return $this->belongsToMany('App\Read', 'book_reads');
    }

    public function languages(){
      return $this->belongsToMany('App\Language', 'book_languages');
    }

    public function collections(){
      return $this->belongsToMany('App\Collection', 'book_collections', 'book_id');
    }

    public function getAuthorsLinks(){
      $authors = $this->authors()->get();

      $result = '';
      foreach ($authors as $author) {
        $result .= '<a href="'.url('/author/'.$author->id).'">'.$author->name.'</a>, ';
      }

      return ($result != ''?substr($result, 0, -2):'');
    }

    public function getGenresLinks(){
      $genres = $this->genres()->get();

      $result = '';
      foreach ($genres as $genre) {
        $result .= '<a href="'.url('/genre/books/'.$genre->id).'" class="mbs-book-genre">'.$genre->name.'</a>, ';
      }

      return ($result != ''?substr($result, 0, -2):'');
    }

    public function getLanguagesLinks(){
      $languages = $this->languages()->get();

      $result = '';
      foreach ($languages as $language) {
        $result .= '<a href="'.url('/language/books/'.$language->id).'">'.$language->language.'</a>, ';
      }

      return ($result != ''?substr($result, 0, -2):'');
    }

    public function getCollectionsLinks(){
      $collections = $this->collections()->get();

      $result = '';
      foreach ($collections as $collection) {
        $result .= '<a href="'.url('/collection/books/'.$collection->id).'">'.$collection->name.'</a>, ';
      }

      return ($result != ''?substr($result, 0, -2):'');
    }

    public function getCover(){
      if(Storage::exists('/covers/'.$this->id.'.png')){
        return asset('/assets/covers/'.$this->id.'.png');
      } else {
        return asset('/assets/covers/empty.png');
      }
    }

}
