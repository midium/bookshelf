<?php

namespace App;

use App\Book;
use App\Nationality;
use Storage;
use App\CustomModel;

class Author extends CustomModel
{
  protected $table = 'authors';
  protected $fillable = ['name', 'website', 'email', 'birth', 'death', 'nationality_id'];
  protected $dates = ['birth', 'death'];

  public function books(){
    return $this->belongsToMany('App\Book', 'book_authors', 'author_id');
  }

  public function nationality(){
    return $this->belongsTo('App\Nationality', 'nationality_id', 'id');
  }

  public function getBirth(){
    $timestamp = $this->birth;

    return ( ! starts_with($timestamp, '-')) ? $timestamp->format('d-m-Y') : '';
  }

  public function getDeath(){
    $timestamp = $this->death;

    return ( ! starts_with($timestamp, '-')) ? $timestamp->format('d-m-Y') : '';
  }

  public function getImage(){
    if(Storage::exists('/authors/'.$this->id.'.png')){
      return asset('/assets/authors/'.$this->id.'.png');
    } else {
      return asset('/assets/authors/empty.png');
    }
  }


}
