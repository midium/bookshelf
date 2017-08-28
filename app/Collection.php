<?php

namespace App;

use App\CustomModel;
use App\Book;

class Collection extends CustomModel
{
  protected $table = 'collections';
  protected $fillable = ['name'];

  public function books(){
    return $this->belongsToMany('App\Book', 'book_collections', 'collection_id');
  }

}
