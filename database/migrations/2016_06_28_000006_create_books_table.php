<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use DB;

class CreateBooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title', 255);
            $table->string('original_title', 255)->nullable()->default(NULL);
            $table->integer('pages')->nullable()->default(NULL);
            $table->integer('year')->nullable()->default(NULL);
            $table->string('isbn', 50)->nullable()->default(NULL);
            $table->integer('vote')->nullable()->default(NULL);
            $table->text('description')->nullable()->default(NULL);
            $table->bigInteger('publisher_id')->nullable()->default(NULL);
        });
        
        DB::statement('ALTER TABLE books ADD FULLTEXT book_title(title, original_title)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('books');
    }
}