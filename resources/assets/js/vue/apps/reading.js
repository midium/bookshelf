// Components declaration
Vue.component('my-header', MyHeader);
Vue.component('my-book', MyBook);
Vue.component('my-uploader', MyUploader);
Vue.component('my-authors', MySelector);
Vue.component('my-genres', MySelector);
Vue.component('my-languages', MySelector);
Vue.component('my-collections', MySelector);
Vue.component('my-publishers', MySelector);

var vm = new Vue({
    el: '#readings',

    // data setup
    data: {
      searchFor: '',
      searchPerformed: false,
      readings: [],
      allBooks: [],
      currentShownBooks:[],
      currentCount: 0,
      currentIndex: 0,
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
    },

    // what to do once the page load at first
    ready: function(){
      this.showLoader();

      // fetching data for add/edit purposes
      this.fetchData();

      this.fetchBooksReading();
    },

    // computations used to show/hide enable/disable controls
    computed: {
    },

    // methods
    methods: {
      clearVote: function(e){
        e.preventDefault();
        this.newBook.vote = 0;
        $('input.add-edit-rating').rating('rate', 0);
      },
      fetchBooksReading: function(){
        this.$http.get('/api/readings', function(data){

          this.allBooks = data;
          this.clearLazyLoaded();
          this.lazyLoadBooks();

          this.hideLoader();

          // If any jquery required
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
        });
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
        if(this.allBooks.length <= 12){
          this.currentShownBooks = this.allBooks;
          this.currentCount = this.allBooks.length;
          this.currentIndex = this.allBooks.length;
        } else {
          var howMany = (this.currentIndex + 12 >= this.allBooks.length) ? (this.allBooks.length - this.currentIndex) : 12;
          var startFrom = this.currentIndex;

          var i = 0;
          var currentAdded = 0;

          while(currentAdded < howMany && startFrom + i < this.allBooks.length ){
            this.currentShownBooks.push(this.allBooks[startFrom + i]);
            this.currentCount++;
            currentAdded++;
            this.currentIndex++;
            i++;
          }
        }
        this.$set('readings', this.currentShownBooks);
        this.$nextTick(function(){
          $('input.rating').rating();
          $('.mbs-book-description').dotdotdot();
          $('[data-toggle="tooltip"]').tooltip();
        });
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
          this.fetchBooksReading();

          this.hideLoader();
        });
        $('#addModal').modal('hide');

      },
      showLoader: function(){
        $('.fullpage-mask').show();
        $('.fullpage-loader').show();
      },
      hideLoader: function(){
        $('.fullpage-mask').hide();
        $('.fullpage-loader').hide();
      },
      setFilter: function(){
        if(!this.searchFor || this.searchFor == '') return;

      },
      clearFilter: function(){
        this.searchFor = '';
        this.fetchAuthors(this.currentLetter);
      }
    },

    // component events
    events: {
      'set-filter': function(textToSearch){
        this.searchFor = textToSearch;
        this.setFilter();
      },
      'clear-filter': function(){
        this.clearFilter();
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
