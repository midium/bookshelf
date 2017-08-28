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

//# sourceMappingURL=search.js.map
