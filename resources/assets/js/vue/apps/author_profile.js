// register component
Vue.component('my-author-book', MyBook)
Vue.component('my-header', MyHeader)

var vm = new Vue({
    el: '#profile',

    // data setup
    data: {
      theAuthor: {
        'name': '',
        'website': '',
        'email': '',
        'nationality': '',
        'avatar': '',
        'birth': '',
        'death': '',
        'books': {}
      },
      author_id: '',
      allBooks: [],
      currentShownBooks:[],
      currentCount: 0,
      currentIndex: 0,
      lazyLoadAmount: 9,
    },

    // what to do once the page load at first
    ready: function(){
      this.fetchSettings();
      this.fetchAuthorDetails();
    },

    // methods
    methods: {
      fetchSettings: function(){
        this.$http.get('/api/getSettings', function(response){
          if(response.success === true){
            this.lazyLoadAmount = parseInt(response.data.author_profile_lazyload,10);
          }
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
      fetchAuthorDetails: function(){

        this.showLoader();

        var id = this.author_id;
        this.$http.get('/api/authorProfile/'+id, function(author){
          this.theAuthor.name = author.name;
          this.theAuthor.website = author.website;
          this.theAuthor.email = author.email;
          this.theAuthor.nationality = author.nationality;
          this.theAuthor.avatar = author.avatar;
          this.theAuthor.birth = author.birth;
          this.theAuthor.death = author.death;

          this.allBooks = author.books;
          this.clearLazyLoaded();
          this.lazyLoadBooks();

          this.hideLoader();

          this.$nextTick(function() {
            $('input.rating').rating();
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
        $('input.rating').rating();

        this.$set('books', this.currentShownBooks);
      },
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
