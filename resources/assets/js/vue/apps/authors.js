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
