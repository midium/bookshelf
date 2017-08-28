<?php

namespace App;

use App\CustomModel;
use App\Book;

class Genre extends CustomModel
{
  protected $table = 'genres';
  protected $fillable = ['name'];

  public function books(){
    return $this->belongsToMany('App\Book', 'book_genres');
  }
}
