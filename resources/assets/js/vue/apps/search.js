
// Components declaration
Vue.component('my-header', MyHeader);
Vue.component('my-uploader', MyUploader);
Vue.component('my-authors', MySelector);
Vue.component('my-found-authors', MySelector);
Vue.component('my-languages', MySelector);
Vue.component('my-found-languages', MySelector);
Vue.component('my-publishers', MySelector);
Vue.component('my-found-publishers', MySelector);

var vm = new Vue({
    el: '#search',

    // data setup
    data: {
      searchIsbn: '',
      newPublisher: true,
      usePublisher: false,
      customPublisher: false,
      newAuthor: true,
      useAuthor: false,
      customAuthor: false,
      newLanguage: true,
      useLanguage: false,
      customLanguage: false,
      useCover: true,
      customCover: false,
      useYear: true,
      useIsbn: true,
      useDescription: true,
      correspondingPublishers: [],
      correspondingAuthors: [],
      correspondingLanguages: [],
      foundBook: {
        'title': '',
        'author': '',
        'publisher': '',
        'year': '',
        'cover': '',
        'description': '',
        'language': '',
        'isbn': '',
      },
      modalData: {
        'title': '',
        'year': '',
        'isbn': '',
        'description': '',
        'publisher': '',
        'publisher_id': '',
        'authors': [],
        'languages': [],
        'cover': '',
        'modaltitle': 'New Book'
      },
      similarSelections: {
        'publisher_id': '',
        'authors': [],
        'languages': [],
      },
      customSelections: {
        'publisher_id': '',
        'authors': [],
        'languages': [],
        'cover': '',
      },
      finalData: {
        'id': '',
        'title': '',
        'year': '',
        'isbn': '',
        'description': '',
        'is_new_publisher': false,
        'publisher_id': '',
        'is_new_author': false,
        'authors': [],
        'is_new_language': false,
        'languages': [],
        'cover': '',
      }
    },

    // what to do once the page load at first
    ready: function(){
      // fetching data for add/edit purposes
      this.fetchData();

    },

    // watches to variables changes
    watch: {
      'newPublisher': function(val, oldVal){
        if(val == true){
          this.usePublisher = false;
          this.customPublisher = false;
        }
      },
      'usePublisher': function(val, oldVal){
        if(val == true){
          this.newPublisher = false;
          this.customPublisher = false;
        }
      },
      'customPublisher': function(val, oldVal){
        if(val == true){
          this.useAuthor = false;
          this.newAuthor = false;
        }
      },
      'newAuthor': function(val, oldVal){
        if(val == true){
          this.useAuthor = false;
          this.customAuthor = false;
        }
      },
      'useAuthor': function(val, oldVal){
        if(val == true){
          this.newAuthor = false;
          this.customAuthor = false;
        }
      },
      'customAuthor': function(val, oldVal){
        if(val == true){
          this.useAuthor = false;
          this.newAuthor = false;
        }
      },
      'newLanguage': function(val, oldVal){
        if(val == true){
          this.useLanguage = false;
          this.customLanguage = false;
        }
      },
      'useLanguage': function(val, oldVal){
        if(val == true){
          this.newLanguage = false;
          this.customLanguage = false;
        }
      },
      'customLanguage': function(val, oldVal){
        if(val == true){
          this.useLanguage = false;
          this.newLanguage = false;
        }
      },
      'useCover': function(val, oldVal){
        if(val == true){
          this.customCover = false;
        }
      },
      'customCover': function(val, oldVal){
        if(val == true){
          this.useCover = false;
        }
      },
    },

    // computations used to show/hide enable/disable controls
    computed: {
      somethingFound: function(){
        return !this.foundBook.title && !this.foundBook.author && !this.foundBook.publisher && !this.foundBook.year && !this.foundBook.cover &&
               !this.foundBook.description && !this.foundBook.language && !this.foundBook.isbn;
      }
    },

    // methods
    methods: {
      fetchData: function(){
        this.$http.get('/api/getAuthorsValueLabel', function(authors){
          this.$set('authors', authors);
        });
        this.$http.get('/api/getLanguagesValueLabel', function(languages){
          this.$set('languages', languages);
        });
        this.$http.get('/api/getPublishersValueLabel', function(publishers){
          this.$set('publishers', publishers);
        });
      },
      onSubmitSearch: function(e){
        e.preventDefault();
        this.showLoader();
        this.$http.get('/api/isbnSearch/'+this.searchIsbn, function(data){
          if(data.success === false){
            swal('Error', data.error, 'error');
          } else {
            this.foundBook = {
              title: data.value.title,
              author: data.value.author,
              publisher: data.value.publisher,
              year: data.value.year,
              cover: data.value.cover,
              description: data.value.description,
              language: data.value.language,
              isbn: data.value.isbn,
            };
            this.correspondingAuthors = data.correspondences.authors;
            this.correspondingPublishers = data.correspondences.publishers;
            this.correspondingLanguages = data.correspondences.languages;

          }

          this.hideLoader();
        });
      },
      onSubmitBook: function(e){
        e.preventDefault();
        this.showLoader();
        this.finalData = {
          id: '',
          title: this.modalData.title,
          year: (this.useYear)?this.modalData.year:'',
          isbn: (this.useIsbn)?this.modalData.isbn:'',
          description: (this.useDescription)?this.modalData.description:'',
          is_new_publisher: this.newPublisher,
          publisher_id: (this.newPublisher)?this.modalData.publisher:((this.customPublisher)?this.customSelections.publisher_id:((this.usePublisher)?this.similarSelections.publisher_id:'')),
          is_new_author: this.newAuthor,
          authors: (this.newAuthor)?this.modalData.authors:((this.customAuthor)?this.customSelections.authors:((this.useAuthor)?this.similarSelections.authors:'')),
          is_new_language: this.newLanguage,
          languages: (this.newLanguage)?this.modalData.languages:((this.customLanguage)?this.customSelections.languages:((this.useLanguage)?this.similarSelections.languages:'')),
          cover: (this.useCover)?this.modalData.cover:((this.customCover)?this.customSelections.cover:''),
        };

        this.$http.post('/api/setBook', this.finalData, function(){
          // refreshing Books
          swal('Info', 'Book created, please go to the shelf to see it.', 'success');

          this.fetchData();

          this.modalData = { title: '',
                           year: '',
                           isbn: '',
                           description: '',
                           publisher: '',
                           publisher_id: '',
                           authors: '',
                           languages: '',
                           cover: '',
                           modaltitle: 'Create New Book' };

          this.newPublisher = true;
          this.usePublisher = false;
          this.customPublisher = false;
          this.newAuthor = true;
          this.useAuthor = false;
          this.customAuthor = false;
          this.newLanguage = true;
          this.useLanguage = false;
          this.customLanguage = false;
          this.useCover = true;
          this.customCover = false;
          this.useYear = true;
          this.useIsbn = true;
          this.useDescription = true;

          this.hideLoader();
        });
        $('#onlineModal').modal('hide');

      },
      createBook: function(){
        this.modalData = { title: this.foundBook.title,
                         year: this.foundBook.year,
                         isbn: this.foundBook.isbn,
                         description: this.foundBook.description,
                         publisher: this.foundBook.publisher,
                         publisher_id: '',
                         authors: this.foundBook.author,
                         languages: this.foundBook.language,
                         cover: this.foundBook.cover,
                         modaltitle: 'Create New Book' };

        $('#onlineModal').modal('show');
      },
      showLoader: function(){
        $('.fullpage-mask').show();
        $('.fullpage-loader').show();
      },
      hideLoader: function(){
        $('.fullpage-mask').hide();
        $('.fullpage-loader').hide();
      }
    },

    // component events
    events: {
    }
});

$('[data-toggle="tooltip"]').tooltip();
