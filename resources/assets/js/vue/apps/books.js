
// Components declaration
Vue.component('my-header', MyHeader);
Vue.component('my-book', MyBook);

var vm = new Vue({
    el: '#books',

    // data setup
    data: {
      entityId: '',
      entityUrl: '',
      searchFor: '',
      allBooks: [],
      currentShownBooks:[],
      currentCount: 0,
      currentIndex: 0,
      lazyLoadAmount: 12,
    },

    // what to do once the page load at first
    ready: function(){
      this.fetchSettings();
      this.fetchBooks();
    },

    // data changing watchers
    watch: {
      'searchFor': function(val, oldVal){
        // Here I should be able to perform the filter to all the books.
        // Every search cause a lazy load reset so to start from 12 shown at first.
        this.clearLazyLoaded();
        this.lazyLoadBooks();

      },
    },

    // computations used to show/hide enable/disable controls
    computed: {
    },

    // methods
    methods: {
      fetchSettings: function(){
        this.$http.get('/api/getSettings', function(response){
          if(response.success === true){
            this.lazyLoadAmount = parseInt(response.data.books_of_object_lazyload, 10);
          }
        });
      },
      fetchBooks: function(){
        this.showLoader();
        this.$http.get('/api/'+this.entityUrl+'/'+this.entityId, function(data){
          if(data.success == false) {
            swal('Error', data.error, 'error');
            return false;
          }

          this.allBooks = data.value;

          this.clearLazyLoaded();
          this.lazyLoadBooks();

          this.hideLoader();

          // If any jquery required
          this.$nextTick(function() {
            $('input.rating').rating();
            $('[data-toggle="tooltip"]').tooltip();
          });

          $('.mbs-content-row').scroll(function() {
             if($('.mbs-content-row').scrollTop() + $('.mbs-content-row').innerHeight() >= $(this)[0].scrollHeight) {
               vm.lazyLoadBooks();

             }
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
        $('input.rating').rating();
      },
      isShowableBook: function(val) {
        if ((!this.searchFor || this.searchFor == '')){
          return true;
        }

        var book_result = (val.title != null && val.title.toLowerCase().indexOf(this.searchFor) > -1);
        var author_result = (val.authors != null && val.authors.toLowerCase().indexOf(this.searchFor) > -1);

        if((book_result || author_result)){
          return true;
        }

        return false;
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
