<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
  protected $table = 'settings';
  public $timestamps = false;
  protected $fillable = ['shelf_lazyload', 'authors_lazyload', 'author_profile_lazyload',
                         'collections_lazyload', 'collection_details_lazyload', 'books_of_object_lazyload',
                         'publishers_pagination', 'genres_pagination', 'languages_pagination'];

}
