"use strict";

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('#token').getAttribute('value');

var MyAddressBar = Vue.extend({
  template: '#addresstab',
  props: {
      'selectedLetter': {
          type: String,
          twoWay: true,
          default: ''
      }
  },
  ready: function(){
    this.dispatchEvent('letterChanged', this.selectedLetter);
  },
  methods: {
      isActive: function(str) {
          if (this.selectedLetter == str) {
              return 'active'
          }
          return ''
      },
      dispatchEvent: function(eventName, args) {
          this.$dispatch(eventName, args)
      },
      letterChanged: function(str) {
        this.selectedLetter = str;
        this.dispatchEvent('letter-changed', str)
      },
  },
  events: {
    setLetter: function(str) {
      this.selectedLetter = str;
      this.dispatchEvent('letterChanged', str);
    }

  }

});

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

var MyUploader = Vue.extend({
  template: '#uploader-template',
  data: {
    imageLoaded: 'false',
  },
  props: ['imageSrc'],
  computed: {
    isClearable: function(){
      if(this.imageLoaded == 'true') return true;

      return false;
    }
  },
  methods: {
    dispatchEvent: function(eventName, args) {
      this.$dispatch(eventName, args)
    },
    previewThumbnail: function(event) {
      var inputObj = event.target;

      if (inputObj.files && inputObj.files[0]) {
        var reader = new FileReader();

        var vm = this;

        // Listen to the load event raised by the file reader in order to show the image
        reader.onload = function(e) {
          vm.imageSrc = e.target.result;
          vm.imageLoaded = 'true';
          vm.dispatchEvent('cover-chosen', vm.imageSrc);
        }

        // making the reader load the image for real
        reader.readAsDataURL(inputObj.files[0]);

      }
    },
    clearThumbnail: function(){
    	$('#thumbnail').files = null;
      $('#thumbnail').val(null);
      this.imageSrc = '';
      this.imageLoaded = 'false';
      this.dispatchEvent('cover-clear');
    }
  },
  events: {
    'image-source': function(str){
      this.clearThumbnail();
      this.imageSrc = str;
    }
  }
});

var MySelector = Vue.extend({
  template: '#selector-control-template',
  props: {
    options: {
      type: Array,
      default() { return [] },
    },
    value: {
      twoWay: true
    },
    placeholder: {
      type: String,
      default: 'Nothing Selected'
    },
    multiple: {
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    search: { // Allow searching (only works when options are provided)
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1024
    },
    closeOnSelect: { // only works when multiple==false
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    disabled: {
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    }
  },
  ready() {
    if (this.value.constructor !== Array) {
      if (this.value.length === 0) {
        this.value = []
      } else {
        this.value = [this.value]
      }
    } else {
      if (!this.multiple && this.value.length > 1) {
        this.value = this.value.slice(0, 1)
      } else if (this.multiple && this.value.length > this.limit) {
        this.value = this.value.slice(0, this.limit)
      }
    }
  },
  data() {
    return {
      searchText: null,
      show: false,
      showNotify: false
    }
  },
  computed: {
    selectedItems: function() {
      let foundItems = [];
      if (this.value.length) {
        for (var item of this.value) {
          if (this.options.length === 0)
          {
            foundItems = this.value;
          }
          else
          {
              let option
              this.options.some(o => {
                if(o.value === item) {
                  option = o
                  return true
                }
              })
              option && foundItems.push(option.label)
          }
        }
      } else if(this.value != 0) {
        if (this.options.length === 0)
        {
          foundItems = this.value;
        }
        else
        {
          let option
          this.options.some(o => {
            if(o.value === this.value) {
              option = o
              return true
            }
          })
          option && foundItems.push(option.label)
        }
      }
      return foundItems.join(', ')

    },
    showPlaceholder: function() {
      return this.value.length === 0
    }
  },
  watch: {
    value(val) {
      if (val.length > this.limit) {
        this.showNotify = true
        this.value.pop()
        setTimeout(() => this.showNotify = false, 1000)
      }
    }
  },
  methods: {
    coerceBoolean: function(val){
      return (typeof val !== "string" ? val :
        val === "true" ? true :
        val === "false" ? false :
        val === "null" ? false :
        val === "undefined" ? false : val);
    },
    select: function(v) {
        if (this.value.constructor === Array && this.value.indexOf(v) === -1) {
          if (this.multiple) {
            this.value.push(v)
          } else {
            this.value = [v]
            this.$dispatch('selection-changed', this.value);
          }
        } else {
          if (this.multiple) {
            this.value.$remove(v)
          } else {
            this.value = [v]
            this.$dispatch('selection-changed', this.value);
          }
        }
        if (this.closeOnSelect) {
          this.toggleDropdown()
        }
    },
    isSelected: function(v) {
      if (this.value.constructor !== Array) {
        return this.value == v
      } else {
        return this.value.indexOf(v) !== -1
      }
    },
    toggleDropdown: function() {
      this.show = !this.show
    }
  },
  events: {
    'clear-selection-search': function(){
      this.searchText = '';
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

//# sourceMappingURL=shelf.js.map
