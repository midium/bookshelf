<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SyncLog extends Model
{
  protected $table = 'sync_logs';
  public $timestamps = false;
  protected $fillable = ['sync_date'];
}
