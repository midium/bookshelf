// register components
Vue.component('my-uploader', MyUploader);
Vue.component('my-book', MyBook);
Vue.component('my-addressbar', MyAddressBar);
Vue.component('my-authors', MySelector);
Vue.component('my-genres', MySelector);
Vue.component('my-languages', MySelector);
Vue.component('my-collections', MySelector);
Vue.component('my-publishers', MySelector);
Vue.component('my-header', MyHeader);

var vm = new Vue({
    el: '#shelf',

    // data setup
    data: {
      searchFor: '',
      currentLetter: '',
      bookCover: '',
      newBook: {
        'id': '',
        'title': '',
        'original_title': '',
        'pages': '',
        'year': '',
        'isbn': '',
        'vote': '',
        'description': '',
        'publisher_id': '',
        'authors': [],
        'genres': [],
        'collections': [],
        'languages': [],
        'cover': '',
        'modaltitle': 'New Book'
      },
      allBooks: [],
      currentShownBooks:[],
      currentCount: 0,
      currentIndex: 0,
      lazyLoadAmount: 12,
    },

    // what to do once the page load at first
    ready: function(){
      // Telling to the address tab control to highlight the proper letter
      var letter = $('.mbs-address-tabs .active a').html();
      letter = (letter == 'All' || letter == 'all' || letter == 'ALL' || typeof(letter) == 'undefined')?'':letter;
      this.$broadcast('setLetter', letter);

      // fetching data for add/edit purposes
      this.fetchData();

      // fetching required Books
      this.fetchBooks(letter);

    },

    // computations used to show/hide enable/disable controls
    computed: {
      bookIsNotFilled: function(){
        if (! this.newBook['title']) return true;

        return false;
      },
    },

    watch: {
      'searchFor': function(val, oldVal){
        // Here I should be able to perform the filter to all the books.
        // Every search cause a lazy load reset so to start from 12 shown at first.
        this.clearLazyLoaded();
        this.lazyLoadBooks();

      },
      'currentLetter': function(val, oldVal){
        // Here I should be able to perform the filter to all the books.
        // Every letter change cause a lazy load reset so to start from 12 shown at first.
        this.clearLazyLoaded();
        this.lazyLoadBooks();

      }
    },

    // methods
    methods: {
      clearVote: function(e){
        e.preventDefault();
        this.newBook.vote = 0;
        $('input.add-edit-rating').rating('rate', 0);
      },
      highlightSearch: function(){
        $('#text_to_search').focus();
      },
      fetchData: function(){
        this.$http.get('/api/getSettings', function(response){
          if(response.success === true){
            this.lazyLoadAmount = parseInt(response.data.shelf_lazyload, 10);
          }
        });
        this.$http.get('/api/getAuthorsValueLabel', function(authors){
          this.$set('authors', authors);
        });
        this.$http.get('/api/getGenresValueLabel', function(genres){
          this.$set('genres', genres);
        });
        this.$http.get('/api/getLanguagesValueLabel', function(languages){
          this.$set('languages', languages);
        });
        this.$http.get('/api/getPublishersValueLabel', function(publishers){
          this.$set('publishers', publishers);
        });
        this.$http.get('/api/getCollectionsValueLabel', function(collections){
          this.$set('collections', collections);
        });
      },
      clearLazyLoaded: function(){
        this.currentShownBooks = [];
        this.currentCount = 0;
        this.currentIndex = 0;
      },
      lazyLoadBooks: function(){
        if(this.allBooks.length <= this.lazyLoadAmount){
          this.currentShownBooks = this.allBooks;
          this.currentCount = this.allBooks.length;
          this.currentIndex = this.allBooks.length;
        } else {
          var howMany = (this.currentIndex + this.lazyLoadAmount >= this.allBooks.length) ? (this.allBooks.length - this.currentIndex) : this.lazyLoadAmount;
          var startFrom = this.currentIndex;

          var i = 0;
          var currentAdded = 0;

          while(currentAdded < howMany && startFrom + i < this.allBooks.length ){
            if(this.isShowableBook(this.allBooks[startFrom + i])){
              this.currentShownBooks.push(this.allBooks[startFrom + i]);
              this.currentCount++;
              currentAdded++;
            }
            this.currentIndex++;
            i++;
          }
        }
        this.$set('books', this.currentShownBooks);
        this.$nextTick(function(){
          $('.mbs-book-description').dotdotdot();
          $('[data-toggle="tooltip"]').tooltip();
        });
      },
      fetchBooks: function(letter){
        this.currentLetter = letter;
        this.showLoader();
        this.$http.get('/api/books', function(books){
          this.allBooks = books;

          this.clearLazyLoaded();
          this.lazyLoadBooks();

          this.hideLoader();
          this.$nextTick(function() {
            $('input.rating').rating();
            $('.mbs-book-description').dotdotdot();
            $('[data-toggle="tooltip"]').tooltip();

            $('.mbs-content-row').scroll(function() {
               if($('.mbs-content-row').scrollTop() + $('.mbs-content-row').innerHeight() >= $(this)[0].scrollHeight) {
                 vm.lazyLoadBooks();

               }
            });
          });

          this.$broadcast('show-badge', 'Total: '+books.length);
        });

      },
      showLoader: function(){
        $('.fullpage-mask').show();
        $('.fullpage-loader').show();
      },
      hideLoader: function(){
        $('.fullpage-mask').hide();
        $('.fullpage-loader').hide();
      },
      onSubmitBook: function(e){
        e.preventDefault();

        this.showLoader();

        var book = this.newBook;
        book.cover = this.bookCover;
        if (book.cover == '') {
          book.cover = $('#imageSrc').attr('src');
        }

        // clearing information on the modal
        this.bookCover = '';
        this.newBook = { id: '',
                         title: '',
                         original_title: '',
                         pages: '',
                         year: '',
                         isbn: '',
                         vote: '',
                         description: '',
                         publisher_id: '',
                         authors: [],
                         genres: [],
                         collections: [],
                         languages: [],
                         cover: '',
                         modaltitle: 'New Book' };

        this.$broadcast('clear-selection-search');

        // saving to db
        this.$http.post('/api/setBook', book, function(){
          // refreshing Books
          this.fetchBooks(this.currentLetter);

          this.hideLoader();
        });
        $('#addModal').modal('hide');

      },
      addBook: function(){
        this.bookCover = '';
        this.newBook = { id: '',
                         title: '',
                         original_title: '',
                         pages: '',
                         year: '',
                         isbn: '',
                         vote: '',
                         description: '',
                         publisher_id: '',
                         authors: [],
                         genres: [],
                         collections: [],
                         languages: [],
                         cover: '',
                         modaltitle: 'New Book' };

        this.$broadcast('clear-selection-search');
        this.$broadcast('book-cover', this.bookCover);
        $('input.add-edit-rating').rating('rate', 0);
        $('#imageSrc').attr('src', this.bookCover);

        $('#addModal').modal('show');

      },
      isShowableBook: function(val) {
        if ((!this.searchFor || this.searchFor == '') && (!this.currentLetter || this.currentLetter == '')){
          return true;
        }

        var book_result = (val.title != null && val.title.toLowerCase().indexOf(this.searchFor) > -1);
        var author_result = (val.authors != null && val.authors.toLowerCase().indexOf(this.searchFor) > -1);
        var initials_result = true;

        if( this.currentLetter != null && this.currentLetter != '' && this.currentLetter.toLowerCase() != 'all' ){
          initials_result = (val.title != null && val.title.toLowerCase().startsWith(this.currentLetter.toLowerCase()));
        }

        if(initials_result && (book_result || author_result)){
          return true;
        }

        return false;
      },
      postURL(path, params, method) {
          var method = method || "post"; // Set method to post by default if not specified.

          // The rest of this code assumes you are not using a library.
          // It can be made less wordy if you use one.
          var form = document.createElement("form");
          form.setAttribute("method", method);
          form.setAttribute("action", path);

          for(var key in params) {
              if(params.hasOwnProperty(key)) {
                  var hiddenField = document.createElement("input");
                  hiddenField.setAttribute("type", "hidden");
                  hiddenField.setAttribute("name", key);
                  hiddenField.setAttribute("value", params[key]);

                  form.appendChild(hiddenField);
               }
          }

          document.body.appendChild(form);
          form.submit();
      }
    },

    // component events
    events: {
      'add-item': function(){
        this.addBook();
      },
      'export-item': function(){
        this.postURL('/api/export','','get');
      },
      'book-delete': function(id){
        var info = { id: id };
        this.$http.post('/api/deleteBook/', info, function(){
          $('.mbs-book-card[data-id="'+id+'"]').fadeOut().remove();
        });

      },
      'book-edit': function(id){
        var that = this;
        this.showLoader();
        this.$http.get('/api/getBook/'+id, function(book){
          if(!book){
            swal('Mmmmh', 'It seems I can\'t find any information related to this book', 'Error');
            return;
          }

          this.bookCover = (book.cover.indexOf('empty')==-1)?book.cover:'';

          this.newBook = { id: book.id,
                           title: book.title,
                           original_title: book.original_title,
                           pages: book.pages,
                           year: book.year,
                           isbn: book.isbn,
                           vote: book.vote,
                           description: book.description,
                           publisher_id: book.publisher_id,
                           authors: (!book.authors)?[]:book.authors,
                           genres: (!book.genres)?[]:book.genres,
                           collections: (!book.collections)?[]:book.collections,
                           languages: (!book.languages)?[]:book.languages,
                           cover: book.cover,
                           modaltitle: 'Edit Book' };
          this.$broadcast('clear-selection-search');
          this.$broadcast('image-source', this.bookCover);

          $('input.add-edit-rating').rating('rate', book.vote);
          $('#imageSrc').attr('src', that.bookCover);

          this.hideLoader();

          $('#addModal').modal('show');

        });

      },
      'cover-chosen': function(dataUrl){
        this.bookCover = dataUrl;
        this.newBook.cover = dataUrl;
      },
      'cover-clear': function(){
        this.bookCover = '';
        this.newBook.cover = '';
      }
    }
});

$('html').keyup(function(e){
    if(e.keyCode == 113) {
        vm.highlightSearch();
    }
});
