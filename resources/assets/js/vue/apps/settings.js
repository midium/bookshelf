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
