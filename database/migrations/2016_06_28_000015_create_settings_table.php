<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->decimal('shelf_lazyload', 10, 0)->default('12');
            $table->decimal('authors_lazyload', 10, 0)->default('12');
            $table->decimal('author_profile_lazyload', 10, 0)->default('9');
            $table->decimal('collections_lazyload', 10, 0)->default('12');
            $table->decimal('collection_details_lazyload', 10, 0)->default('9');
            $table->decimal('books_of_object_lazyload', 10, 0)->default('12');
            $table->decimal('publishers_pagination', 10, 0)->default('12');
            $table->decimal('genres_pagination', 10, 0)->default('12');
            $table->decimal('languages_pagination', 10, 0)->default('12');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('settings');
    }
}