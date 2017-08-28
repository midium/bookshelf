Vue.component('my-header', MyHeader);

var vm = new Vue({
    el: '#details',

    // data setup
    data: {
      theBook: {
        'id': '',
        'title': '',
        'original_title': '',
        'pages': '',
        'year': '',
        'isbn': '',
        'vote': '',
        'description': '',
        'publisher': [],
        'cover': '',
        'authors': '',
        'genres': '',
        'collections': [],
        'languages': [],
      },
      book_id: ''
    },

    // what to do once the page load at first
    ready: function(){
      this.fetchBookDetails();
    },

    // methods
    methods: {
      showLoader: function(){
        $('.fullpage-mask').show();
        $('.fullpage-loader').show();
      },
      hideLoader: function(){
        $('.fullpage-mask').hide();
        $('.fullpage-loader').hide();
      },
      fetchBookDetails: function(){

        this.showLoader();

        var id = this.book_id;
        this.$http.get('/api/bookDetails/'+id, function(book){
          this.theBook.id = book.id;
          this.theBook.title = book.title;
          this.theBook.original_title = book.original_title;
          this.theBook.pages = book.pages;
          this.theBook.year = book.year;
          this.theBook.vote = book.vote;
          this.theBook.isbn = book.isbn;
          this.theBook.description = book.description;
          this.theBook.publisher = book.publisher;
          this.theBook.cover = book.cover;
          this.theBook.authors = book.authors;
          this.theBook.genres = book.genres;
          this.theBook.collections = book.collections;
          this.theBook.languages = book.languages;

          this.hideLoader();

          this.$nextTick(function(){
            $('input.rating').rating('rate', book.vote);
          });
        });

      }
    },

    // computations
    computed: {
      nationalityAvailable: function(){
        return this.theAuthor.nationality != '' && this.theAuthor.nationality != null;
      },
      websiteAvailable: function(){
        return this.theAuthor.website != '' && this.theAuthor.website != null;
      },
      emailAvailable: function(){
        return this.theAuthor.email != '' && this.theAuthor.email != null;
      },
      birthAvailable: function(){
        return this.theAuthor.birth != '' && this.theAuthor.birth != null;
      },
      deathAvailable: function(){
        return this.theAuthor.death != '' && this.theAuthor.death != null;
      },
    },

});
