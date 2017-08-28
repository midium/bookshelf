<?php

namespace App;

use App\CustomModel;
use App\Author;
use App\Publisher;

class Nationality extends CustomModel
{
  protected $table = 'nationalities';
  protected $fillable = ['name', 'code'];

  public function authors(){
    return $this->hasMany('App\Author', 'id', 'nationality_id');
  }

  public function publishers(){
    return $this->hasMany('App\Publisher', 'id', 'nationality_id');
  }

}
