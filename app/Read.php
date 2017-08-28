<?php

namespace App;

use App\CustomModel;
use App\Book;

class Read extends CustomModel
{
  protected $table = 'reads';
  protected $fillable = ['read_status_id', 'start_date', 'end_date'];

  public function books(){
    return $this->belongsToMany('App\Book', 'book_reads');
  }
}
