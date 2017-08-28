<?php

namespace App;

use App\CustomModel;
use App\Book;

class Language extends CustomModel
{
  protected $table = 'languages';
  protected $fillable = ['code', 'language'];

  public function books(){
    return $this->belongsToMany('App\Book', 'book_languages');
  }
}
