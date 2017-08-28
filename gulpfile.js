var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass('main.scss');
    //vendor.js
    mix.scripts([
        'vendor/vue.min.js',
        'vendor/vue-resource.min.js',
        'vendor/vuetable.js',
        'vendor/vuestrap.min.js',
    ], 'public/js/vendor.js');
    //shef.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-addressbar.js',
      'vue/components/vue-book-card.js',
      'vue/components/vue-uploader.js',
      'vue/components/vue-selector.js',
      'vue/components/vue-header.js',
      'vue/apps/shelf.js',
    ], 'public/js/vue/shelf.js');
    //reading.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-book-card.js',
      'vue/components/vue-uploader.js',
      'vue/components/vue-selector.js',
      'vue/components/vue-header.js',
      'vue/apps/reading.js',
    ], 'public/js/vue/reading.js');
    //publishers.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-pagination.js',
      'vue/components/vue-header.js',
      'vue/apps/publishers.js',
    ], 'public/js/vue/publishers.js');
    //languages.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-pagination.js',
      'vue/components/vue-header.js',
      'vue/apps/languages.js',
    ], 'public/js/vue/languages.js');
    //genres.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-pagination.js',
      'vue/components/vue-header.js',
      'vue/apps/genres.js',
    ], 'public/js/vue/genres.js');
    //collections.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-collection.js',
      'vue/components/vue-checklist.js',
      'vue/components/vue-header.js',
      'vue/apps/collections.js',
    ], 'public/js/vue/collections.js');
    //collection_details.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-book-card.js',
      'vue/components/vue-header.js',
      'vue/apps/collection_details.js',
    ], 'public/js/vue/collection_details.js');
    //book_reads.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-selector.js',
      'vue/components/vue-book-read.js',
      'vue/components/vue-header.js',
      'vue/apps/book_reads.js',
    ], 'public/js/vue/book_reads.js');
    //book_details.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-header.js',
      'vue/apps/book_details.js',
    ], 'public/js/vue/book_details.js');
    //authors.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-addressbar.js',
      'vue/components/vue-author-card.js',
      'vue/components/vue-uploader.js',
      'vue/components/vue-header.js',
      'vue/apps/authors.js',
    ], 'public/js/vue/authors.js');
    //author_profile.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-book-card.js',
      'vue/components/vue-header.js',
      'vue/apps/author_profile.js',
    ], 'public/js/vue/author_profile.js');
    //books.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-book-card.js',
      'vue/components/vue-header.js',
      'vue/apps/books.js',
    ], 'public/js/vue/books.js');
    //search.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-header.js',
      'vue/components/vue-selector.js',
      'vue/components/vue-uploader.js',
      'vue/apps/search.js',
    ], 'public/js/vue/search.js');
    //settings.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-header.js',
      'vue/apps/settings.js',
    ], 'public/js/vue/settings.js');
    //stats.js
    mix.scripts([
      'vue/commons/token.js',
      'vue/components/vue-header.js',
      'vue/apps/stats.js',
    ], 'public/js/vue/stats.js');
});
