"use strict";

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('#token').getAttribute('value');

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

//# sourceMappingURL=book_details.js.map
