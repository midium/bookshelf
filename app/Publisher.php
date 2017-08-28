<?php

namespace App;

use App\CustomModel;
use App\Book;
use App\Publisher;

class Publisher extends CustomModel
{
  protected $table = 'publishers';
  protected $fillable = ['name', 'website', 'email', 'nationality_id'];

  public function books(){
    return $this->hasMany('App\Book');
  }

  public function nationality(){
    return $this->belongsTo('App\Nationality', 'nationality_id', 'id');
  }

  public function booksCount()
  {
    return $this->hasMany('App\Book')
      ->selectRaw('publisher_id, count(*) as count')
      ->groupBy('publisher_id');
  }

  public function getBooksCountAttribute()
  {
    // if relation is not loaded already, let's do it first
    if ( ! array_key_exists('booksCount', $this->relations))
      $this->load('booksCount');

    $related = $this->getRelation('booksCount');

    // then return the count directly
    return ($related) ? (int) $related->first()->count : 0;
  }
}
