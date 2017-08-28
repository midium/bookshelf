"use strict";

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('#token').getAttribute('value');

var MyBook = Vue.extend({
  template: '#book-card-template',
  props: {
    myBook: {
      default: null
    },
    showDetails: { // Allow to hide details tooltip, default hide
      type: Boolean,
      coerce: this.coerceBoolean,
      default: true
    },
    hasTools: { // Show/hide tools, default shown
      type: Boolean,
      coerce: this.coerceBoolean,
      default: true
    },
    allowEdit: { // Show/hide edit tools (if hasTools is false, then this will be hidden in any case), default shown
      type: Boolean,
      coerce: this.coerceBoolean,
      default: true
    },
    allowDelete: { // Show/hide delete tools (if hasTools is false, then this will be hidden in any case), default shown
      type: Boolean,
      coerce: this.coerceBoolean,
      default: true
    },
    howManyOnRow: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      book_id: '',
      flipped_card: false,
    }
  },
  methods: {
    cardFlip: function(){
      this.flipped_card = !this.flipped_card;
    },
    coerceBoolean: function(val){
      return (typeof val !== "string" ? val :
        val === "true" ? true :
        val === "false" ? false :
        val === "null" ? false :
        val === "undefined" ? false : val);
    },
    columnWidth: function(){
      if(this.howManyOnRow){
        return '' + (12 / this.howManyOnRow);
      }

      return '3';
    },
    deleteBook: function(e){
      e.preventDefault();

      var that = this;

      swal({
       title: 'Are you sure?',
       text: "You are about to remove this book, you won't be able to revert this!",
       type: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes, delete it!'
     }).then(function(isConfirm) {
       if (isConfirm) {
         that.$dispatch('book-delete', that.book_id);
       }
     })
   },
   editBook: function(e) {
     e.preventDefault();

     this.$dispatch('book-edit', this.book_id);
   }
  }
});

var MyHeader = Vue.extend({
  template: '#header-control-template',
  props: {
    headerTitle: {
      type: String,
      default: 'Title'
    },
    searchPlaceholder: {
      type: String,
      default: 'Search all'
    },
    search: { // Allow searching
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    filterSearch: { // Let the control know this will be used as filter for the v-for calls
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    exportExcel: { // Allow data export icon
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    exportButtonTooltip: {
      type: String,
      default: ''
    },
    backButton: { // Allow back button
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    clearButton: { // Allow search clear button
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    addButton: { // Allow add button
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    addButtonTooltip: {
      type: String,
      default: ''
    },
    showImage: { // Allow image on header
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: ''
    },
    searchFor: {
      type: String,
      twoWay: true,
      default: ''
    }
  },
  data() {
    return {
      searchPerformed: false,
      showBadge: false,
      badgeText: '',
      isMobileView: false,
    }
  },
  ready() {
    this.isMobileView = ($(window).width() < 768);
  },
  methods: {
    coerceBoolean: function(val){
      return (typeof val !== "string" ? val :
        val === "true" ? true :
        val === "false" ? false :
        val === "null" ? false :
        val === "undefined" ? false : val);
    },
    setFilter: function(){
      if(!this.filterSearch){
        this.searchPerformed = true;
      }
      this.dispatchEvent('set-filter', this.searchFor);
    },
    clearFilter: function(){
      this.searchFor = '';
      if(!this.filterSearch){
        this.searchPerformed = false;
      }
      this.dispatchEvent('clear-filter');
    },
    addItem: function(){
      this.dispatchEvent('add-item');
    },
    exportItem: function(){
      this.dispatchEvent('export-item');
    },
    dispatchEvent: function(event, data){
      this.$dispatch(event, data);
    },
  },
  computed: {
  },
  events: {
    'show-badge': function(val) {
      this.showBadge = true;
      this.badgeText = val;
    },
    'search-cleared': function(){
      this.searchFor = '';
    }
  }
});

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

//# sourceMappingURL=author_profile.js.map
