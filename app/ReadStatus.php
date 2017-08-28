<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Book;

class ReadStatus extends Model
{
  protected $table = 'read_status';
  public $timestamps = false;
  protected $fillable = ['status'];

  public function books(){
    return $this->belongsToMany('App\Book', 'book_reads');
  }
}
