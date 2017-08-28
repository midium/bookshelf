<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/


Route::auth();

Route::group(['middleware' => 'auth.api'], function () {
  Route::get('api/uuid', 'ApiController@generateUuid');
});

Route::group(['middleware' => 'auth'], function () {

  // Books
  Route::get('/', 'BooksController@index');
  Route::get('/home', 'BooksController@index');
  Route::get('/reading', 'BooksController@nowReading');
  Route::get('api/readings', 'BooksController@getReadingsBooks');
  Route::get('/book/{id}', 'BooksController@bookDetails');
  Route::get('/reads/{id}', 'BooksController@bookReads');
  Route::get('api/books', 'BooksController@getBooks');
  Route::get('api/statuses', 'BooksController@getReadStatuses');
  Route::post('api/setBook', 'BooksController@setBook');
  Route::post('api/setBookRead', 'BooksController@setBookRead');
  Route::post('api/deleteBookRead', 'BooksController@deleteBookRead');
  Route::get('api/getBook/{id}', 'BooksController@getBook');
  Route::get('api/bookDetails/{id}', 'BooksController@getBookDetails');
  Route::get('api/bookReads/{id}', 'BooksController@getBookReads');
  Route::post('api/deleteBook', 'BooksController@deleteBook');
  Route::get('api/books_collection', 'BooksController@getBooksValueLabel');
  Route::get('api/export', 'BooksController@exportBookShelf');

  // Statistics
  Route::get('/stats', 'StatsController@index');
  Route::get('/api/book_stats', 'StatsController@book');
  Route::get('/api/author_stats', 'StatsController@author');
  Route::get('/api/publisher_stats', 'StatsController@publisher');
  Route::get('/api/genre_stats', 'StatsController@genre');
  Route::get('/api/read_stats', 'StatsController@read');
  Route::get('/api/vote_stats', 'StatsController@vote');
  Route::get('stats/books/{year}', 'StatsController@statsBooks');
  Route::get('api/getStatsBooks/{year}', 'StatsController@getStatsBooks');

  // Collections
  Route::get('/collections', 'CollectionsController@index');
  Route::get('/collection/{id}', 'CollectionsController@showCollection');
  Route::get('api/collections', 'CollectionsController@getCollections');
  Route::get('api/getCollectionsValueLabel', 'CollectionsController@getCollectionsValueLabel');
  Route::post('api/setCollection', 'CollectionsController@setCollection');
  Route::post('api/deleteCollection', 'CollectionsController@deleteCollection');
  Route::get('api/getCollection/{id}', 'CollectionsController@getCollection');
  Route::get('/api/collection/{id}', 'CollectionsController@getCollectionDetails');

  // Authors
  Route::get('/authors', 'AuthorsController@index');
  Route::get('/author/{id}', 'AuthorsController@authorProfile');
  Route::get('author/books/{id}', 'AuthorsController@authorBooks');
  Route::get('api/authorProfile/{id}', 'AuthorsController@getAuthorProfile');
  Route::get('api/authors', 'AuthorsController@getAuthors');
  Route::get('api/getAuthorsValueLabel', 'AuthorsController@getAuthorsValueLabel');
  Route::post('api/deleteAuthor', 'AuthorsController@deleteAuthor');
  Route::post('api/setAuthor', 'AuthorsController@setAuthor');
  Route::get('api/getAuthor/{id}', 'AuthorsController@getAuthor');
  Route::get('api/getAuthorBooks/{id}', 'AuthorsController@getAuthorBooks');

  // Publishers
  Route::get('/publishers', 'PublishersController@index');
  Route::get('publisher/books/{id}', 'PublishersController@publisherBooks');
  Route::get('api/getPublisherBooks/{id}', 'PublishersController@getPublisherBooks');
  Route::get('api/publishers', 'PublishersController@getPublishers');
  Route::get('api/getPublishersValueLabel', 'PublishersController@getPublishersValueLabel');
  Route::get('api/allPublishers', 'PublishersController@getAllPublishers');
  Route::post('api/setPublisher', 'PublishersController@setPublisher');
  Route::post('api/deletePublisher', 'PublishersController@deletePublisher');

  // Genres
  Route::get('/genres', 'GenresController@index');
  Route::get('genre/books/{id}', 'GenresController@genreBooks');
  Route::get('api/getGenreBooks/{id}', 'GenresController@getGenreBooks');
  Route::get('api/getGenresValueLabel', 'GenresController@getGenresValueLabel');
  Route::get('api/genres', 'GenresController@getGenres');
  Route::post('api/setGenre', 'GenresController@setGenre');
  Route::post('api/deleteGenre', 'GenresController@deleteGenre');

  // Languages
  Route::get('/languages', 'LanguagesController@index');
  Route::get('language/books/{id}', 'LanguagesController@languageBooks');
  Route::get('api/getLanguageBooks/{id}', 'LanguagesController@getLanguageBooks');
  Route::get('api/languages', 'LanguagesController@getLanguages');
  Route::get('api/getLanguagesValueLabel', 'LanguagesController@getLanguagesValueLabel');
  Route::post('api/setLanguage', 'LanguagesController@setLanguage');
  Route::post('api/deleteLanguage', 'LanguagesController@deleteLanguage');

  // Settings
  Route::get('settings', 'SettingsController@index');
  Route::get('api/getSettings', 'SettingsController@getSettings');
  Route::post('api/setSettings', 'SettingsController@setSettings');
  Route::get('api/getCurrentPassword', 'SettingsController@getCurrentPassword');
  Route::post('api/doesPasswordCorrespond', 'SettingsController@doesPasswordCorrespond');
  Route::post('api/changePassword', 'SettingsController@changePassword');

  // Online search
  Route::get('online', 'SearchController@index');
  Route::get('api/isbnSearch/{isbn}', 'SearchController@isbnSearch');

  // Nationalities
  Route::get('api/nationalities', function(){
    return App\Nationality::orderBy('name')->get();
  });

});

Route::auth();
