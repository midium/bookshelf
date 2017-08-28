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

// register components
Vue.component('my-header', MyHeader);

var vm = new Vue({

    el: '#settings',

    // data setup
    data: {
      settings: {
        lazyLoad: {
          shelf: '',
          authors: '',
          authorProfile: '',
          collections: '',
          collectionDetails: '',
          objectsBooks: '',
        },
        pagination: {
          publishers: '',
          genres: '',
          languages: '',
        },
      },
      changeAllowed: false,
      password: {
        current: '',
        new: '',
        confirm: '',
      },
      currentPassword: '',
      isCurrentPasswordOk: true,
    },

    // what to do once the page load at first
    ready: function(){
      this.fetchSettings();
      this.$nextTick(function(){
        $('[data-toggle="tooltip"]').tooltip();

      });
    },

    // methods
    methods: {
      fetchCurrentPassword: function(){
        this.$http.get('/api/getCurrentPassword', function(response){
          this.currentPassword = response.data;
        });
      },
      fetchSettings: function(){
        this.showLoader();

        this.fetchCurrentPassword();

        this.$http.get('/api/getSettings', function(response){
          if(response.success === true){
            this.settings.lazyLoad.shelf = response.data.shelf_lazyload;
            this.settings.lazyLoad.authors = response.data.authors_lazyload;
            this.settings.lazyLoad.authorProfile = response.data.author_profile_lazyload;
            this.settings.lazyLoad.collections = response.data.collections_lazyload;
            this.settings.lazyLoad.collectionDetails = response.data.collection_details_lazyload;
            this.settings.lazyLoad.objectsBooks = response.data.books_of_object_lazyload;

            this.settings.pagination.publishers = response.data.publishers_pagination;
            this.settings.pagination.genres = response.data.genres_pagination;
            this.settings.pagination.languages = response.data.languages_pagination;
          } else {
            swal('Error', response.error, 'error');
          }

          this.hideLoader();
        });
      },
      settingsSave: function(e){
        e.preventDefault();

        this.showLoader();

        this.$http.post('/api/setSettings', this.settings, function(response){
          if(response.success === true){
            swal('Success', 'Settings saved successfully', 'success');
          } else {
            swal('Error', response.error, 'error');
          }

          this.hideLoader();
        });

      },
      submitNewPassword: function(e){
        e.preventDefault();

        this.$http.post('api/changePassword', this.password, function(response){
          if(response.success === true){
            swal('Success', 'Password changed successfully', 'success');
          } else {
            swal('Error', response.error, 'error');
          }

          this.toggleChangePassword();
        });
      },
      toggleChangePassword: function(){
        this.changeAllowed = !this.changeAllowed;
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

    // computations
    computed: {
      isNewPasswordCorrect: function(){
        if (this.password.new != this.password.confirm) return false;

        return true;
      },
      areAllPasswordsEnteredAndValid: function(){
        if (this.password.current == '' && this.password.new == '' && this.password.confirm == '') return false;
        if (this.password.current != '' && (this.password.new != this.password.confirm)) return false;

        return true;
      },
      isCurrentPasswordCorrect: function(){
        if(this.password.current == '') return true;

        var that = this;
        this.$http.post('/api/doesPasswordCorrespond', this.password, function(response){
          that.isCurrentPasswordOk = response.success
        });

        return this.isCurrentPasswordOk;
      }
    },

    // events
    events: {
    }

});

//# sourceMappingURL=settings.js.map
