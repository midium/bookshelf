
// Components declaration
Vue.component('my-header', MyHeader);
Vue.component('my-book', MyBook);

var vm = new Vue({
    el: '#collection',

    // data setup
    data: {
      theCollection: {
        'id': '',
        'name': '',
        'vote': 0,
        'books': [],
        'authors': [],
        'genres': [],
        'publishers': [],
        'languages': [],
      },
      collection_id: '',
      allBooks: [],
      currentShownBooks:[],
      currentCount: 0,
      currentIndex: 0,
      lazyLoadAmount: 12,
    },

    // what to do once the page load at first
    ready: function(){
      this.fetchCollection();
    },

    // computations used to show/hide enable/disable controls
    computed: {
    },

    // methods
    methods: {
      fetchSettings: function(){
        this.$http.get('/api/getSettings', function(response){
          if(response.success === true){
            this.lazyLoadAmount = parseInt(response.data.collection_details_lazyload, 10);
          }
        });
      },
      fetchCollection: function(){
        this.showLoader();
        this.$http.get('/api/collection/'+this.collection_id, function(data){
          if(data.success == false) {
            swal('Error', data.error, 'error');
            return false;
          }

          this.theCollection.id = data.value.id;
          this.theCollection.name = data.value.name;
          this.theCollection.vote = data.value.vote;
          this.theCollection.authors = data.value.authors;
          this.theCollection.genres = data.value.genres;
          this.theCollection.publishers = data.value.publishers;
          this.theCollection.languages = data.value.languages;

          this.allBooks = data.value.books;
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
            this.currentShownBooks.push(this.allBooks[startFrom + i]);
            this.currentCount++;
            currentAdded++;
            this.currentIndex++;
            i++;
          }
        }
        this.theCollection.books = this.currentShownBooks;
        this.$nextTick(function(){
          $('input.rating').rating();
          $('.mbs-book-description').dotdotdot();
          $('[data-toggle="tooltip"]').tooltip();
        });
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
