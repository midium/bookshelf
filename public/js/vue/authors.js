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

var MyAuthor = Vue.extend({
  template: '#author-card-template',
  props: ['myAuthor'],
  data: {
    author_id: ''
  },
  methods: {
    deleteAuthor: function(e){
      e.preventDefault();

      var that = this;

      swal({
       title: 'Are you sure?',
       text: "You are about to remove this author, you won't be able to revert this!",
       type: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes, delete it!'
     }).then(function(isConfirm) {
       if (isConfirm) {
         that.$dispatch('author-delete', that.author_id);
       }
     })
   },
   editAuthor: function(e) {
     e.preventDefault();

     this.$dispatch('author-edit', this.author_id);
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
Vue.component('my-author', MyAuthor);
Vue.component('my-addressbar', MyAddressBar);
Vue.component('my-header', MyHeader);

var vm = new Vue({
    el: '#authors',

    // data setup
    data: {
      searchFor: '',
      currentLetter: '',
      authorAvatar: '',
      newAuthor: {
        'id': '',
        'name': '',
        'website': '',
        'email': '',
        'nationality': '',
        'nationality_id': '',
        'avatar': '',
        'birth': '',
        'death': '',
        'modaltitle': 'New Author'
      },
      allAuthors: [],
      currentShownAuthors:[],
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

      // fetching settings
      this.fetchSettings();

      // fetching nationalities for add/edit purposes
      this.fetchNationalities();

      // fetching required authors
      this.fetchAuthors(letter);

    },

    // computations used to show/hide enable/disable controls
    computed: {
      authorIsNotFilled: function(){
        if (! this.newAuthor['name']) return true;

        return false;
      }
    },

    watch: {
      'searchFor': function(val, oldVal){
        // Here I should be able to perform the filter to all the authors.
        // Every search cause a lazy load reset so to start from 12 shown at first.
        this.clearLazyLoaded();
        this.lazyLoadAuthors();

      },
      'currentLetter': function(val, oldVal){
        // Here I should be able to perform the filter to all the authors.
        // Every letter change cause a lazy load reset so to start from 12 shown at first.
        this.clearLazyLoaded();
        this.lazyLoadAuthors();

      }
    },

    // methods
    methods: {
      highlightSearch: function(){
        $('#text_to_search').focus();
      },
      fetchSettings: function(){
        this.$http.get('/api/getSettings', function(response){
          if(response.success === true){
            this.lazyLoadAmount = parseInt(response.data.authors_lazyload, 10);
          }
        });
      },
      fetchNationalities: function(){
        this.$http.get('/api/nationalities', function(nationalities){
          this.$set('nationalities', nationalities);
        });
      },
      fetchAuthors: function(letter){
        this.currentLetter = letter;
        this.showLoader();
        this.$http.get('/api/authors?letter='+letter, function(authors){
          this.allAuthors = authors;

          this.clearLazyLoaded();
          this.lazyLoadAuthors();

          this.hideLoader();

          this.$broadcast('show-badge', 'Total: ' + authors.length);

          this.$nextTick(function(){
            $('[data-toggle="tooltip"]').tooltip();
            $('#birth').datetimepicker({
              format: 'YYYY-MM-DD'
            });
            $('#death').datetimepicker({
                useCurrent: false,
                format: 'YYYY-MM-DD'
            });
            $("#birth").on("dp.change", function (e) {
                $('#death').data("DateTimePicker").minDate(e.date);
            });
            $("#death").on("dp.change", function (e) {
                $('#birth').data("DateTimePicker").maxDate(e.date);
            });

            $('.mbs-content-row').scroll(function() {
               if($('.mbs-content-row').scrollTop() + $('.mbs-content-row').innerHeight() >= $(this)[0].scrollHeight) {
                 vm.lazyLoadAuthors();
               }
            });

          });
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
      onSubmitAuthor: function(e){
        e.preventDefault();
        this.showLoader();
        var author = this.newAuthor;

        author.avatar = this.authorAvatar;
        if (author.avatar == '') {
          author.avatar = $('#imageSrc').attr('src');
        }

        // clearing information on the modal
        this.authorAvatar = '';
        this.newAuthor = { id: '', name: '', website: '', email: '', birth: '', death: '', nationality_id: '', avatar: '', modaltitle: 'New Author' };

        // saving to db
        this.$http.post('/api/setAuthor', author, function(){
          // refreshing authors
          this.fetchAuthors(this.currentLetter);
          this.hideLoader();
        });
        $('#addModal').modal('hide');

      },
      addAuthor: function(){
        var that = this;

        this.authorAvatar = '';
        this.newAuthor = { id: '', name: '', website: '', email: '', birth: '', death: '', nationality_id: '', avatar: '', modaltitle: 'New Author' };
        that.$broadcast('author-avatar', this.authorAvatar);
        $('#imageSrc').attr('src', this.authorAvatar);

        $('#addModal').modal('show');

      },
      isShowableAuthor: function(val) {
        if ((!this.searchFor || this.searchFor == '') && (!this.currentLetter || this.currentLetter == '')) return true;

        var author_result = (val.name != null && val.name.toLowerCase().indexOf(this.searchFor) > -1);
        var initials_result = true;

        if( this.currentLetter != null && this.currentLetter != '' && this.currentLetter.toLowerCase() != 'all' ){
          initials_result = (val.name != null && val.name.toLowerCase().startsWith(this.currentLetter.toLowerCase()));
        }

        return initials_result && author_result;
      },
      clearLazyLoaded: function(){
        this.currentShownAuthors = [];
        this.currentCount = 0;
        this.currentIndex = 0;
      },
      lazyLoadAuthors: function(){
        if(this.allAuthors.length <= this.lazyLoadAmount){
          this.currentShownAuthors = this.allAuthors;
          this.currentCount = this.allAuthors.length;
          this.currentIndex = this.allAuthors.length;
        } else {
          var howMany = (this.currentIndex + this.lazyLoadAmount >= this.allAuthors.length) ? (this.allAuthors.length - this.currentIndex) : this.lazyLoadAmount;
          var startFrom = this.currentIndex;

          var i = 0;
          var currentAdded = 0;

          while(currentAdded < howMany && startFrom + i < this.allAuthors.length ){
            if(this.isShowableAuthor(this.allAuthors[startFrom + i])){
              this.currentShownAuthors.push(this.allAuthors[startFrom + i]);
              this.currentCount++;
              currentAdded++;
            }
            this.currentIndex++;
            i++;
          }
        }
        this.$set('authors', this.currentShownAuthors);
      },
    },

    // component events
    events: {
      'add-item': function(){
        this.addAuthor();
      },
      'author-delete': function(id){
        var info = { id: id };
        this.$http.post('/api/deleteAuthor/', info, function(){
          $('.author-card[data-id="'+id+'"]').fadeOut().remove();
        });

      },
      'author-edit': function(id){
        var that = this;
        this.showLoader();
        this.$http.get('/api/getAuthor/'+id, function(author){
          if(!author){
            swal('Mmmmh', 'It seems I can\'t find any information related to this author', 'Error');
            return;
          }

          this.authorAvatar = (author.avatar.indexOf('empty')==-1)?author.avatar:'';
          this.newAuthor = { id: author.id, name: author.name, website: author.website, email: author.email, birth: author.birth, death: author.death, nationality_id: author.nationality_id, avatar: author.avatar, modaltitle: 'Edit Author' };
          this.$broadcast('image-source', that.authorAvatar);

          $('#imageSrc').attr('src', that.authorAvatar);

          this.hideLoader();

          $('#addModal').modal('show');

        });

      },
      'cover-chosen': function(dataUrl){
        this.authorAvatar = dataUrl;
        this.newAuthor.avatar = dataUrl;
      },
      'cover-clear': function(){
        this.authorAvatar = '';
        this.newAuthor.avatar = '';
      }
    }
});

$('html').keyup(function(e){
    if(e.keyCode == 113) {
        vm.highlightSearch();
    }
});

//# sourceMappingURL=authors.js.map
