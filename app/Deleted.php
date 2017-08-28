<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Deleted extends Model
{
  protected $table = 'deleted';
  public $timestamps = false;
  protected $fillable = ['uuid', 'table'];
}
