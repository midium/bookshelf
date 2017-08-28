// register components
Vue.component('my-book-collection', MyCollection);
Vue.component('my-checklist', MyChecklist);
Vue.component('my-header', MyHeader);

var vm = new Vue({

    el: '#collections',

    // data setup
    data: {
      theCollection: {
        'id': '',
        'name': '',
        'books': [],
        'modaltitle': 'New Collection'
      },
      allBooks: [],
      searchCollection: null,
      selectedOnCollection: [],
      selectedOnAvailable:[],
      allCollections: [],
      currentShownCollections:[],
      currentCount: 0,
      currentIndex: 0,
      lazyLoadAmount: 12,
    },

    // what to do once the page load at first
    ready: function(){
      this.fetchSettings();
      this.fetchCollectionsAndBooks();
    },

    watch: {
      'searchCollection': function(val, oldVal){
        // Here I should be able to perform the filter to all the collections.
        // Every search cause a lazy load reset so to start from 12 shown at first.
        this.clearLazyLoaded();
        this.lazyLoadCollections();

      },
    },

    // methods
    methods: {
      fetchSettings: function(){
        this.$http.get('/api/getSettings', function(response){
          if(response.success === true){
            this.lazyLoadAmount = parseInt(response.data.collections_lazyload,10);
          }
        });
      },
      clearArrays: function(){
        this.selectedOnCollection = [];
        this.selectedOnAvailable = [];
      },
      addToCollection: function(){
        if(this.selectedOnAvailable.length > 0){
          for (var item of this.selectedOnAvailable) {
            this.theCollection.books.push(item);
          }
          this.selectedOnAvailable = [];
        }
      },
      removeFromCollection: function(){
        if(this.selectedOnCollection.length > 0){
          for (var item of this.selectedOnCollection) {
            this.theCollection.books.$remove(item);
          }
          this.selectedOnCollection = [];
        }
      },
      clearLazyLoaded: function(){
        this.currentShownCollections = [];
        this.currentCount = 0;
        this.currentIndex = 0;
      },
      lazyLoadCollections: function(){
        if(this.allCollections.length <= this.lazyLoadAmount){
          this.currentShownCollections = this.allCollections;
          this.currentCount = this.allCollections.length;
          this.currentIndex = this.allCollections.length;
        } else {
          var howMany = (this.currentIndex + this.lazyLoadAmount >= this.allCollections.length) ? (this.allCollections.length - this.currentIndex) : this.lazyLoadAmount;
          var startFrom = this.currentIndex;

          var i = 0;
          var currentAdded = 0;

          while(currentAdded < howMany && startFrom + i < this.allCollections.length ){
            if(this.isShowableCollection(this.allCollections[startFrom + i])){
              this.currentShownCollections.push(this.allCollections[startFrom + i]);
              this.currentCount++;
              currentAdded++;
            }
            this.currentIndex++;
            i++;
          }
        }
        this.$set('collections', this.currentShownCollections);
      },
      isShowableCollection: function(val) {
        if ((!this.searchCollection || this.searchCollection == '')){
          return true;
        }

        return (val.name != null && val.name.toLowerCase().indexOf(this.searchCollection) > -1);
      },
      fetchCollections: function(manageLoader){

        if (manageLoader) {
          this.showLoader();
        }

        var id = $('input#id').val();
        this.$http.get('/api/collections/', function(collections){
          this.allCollections = collections;

          this.clearLazyLoaded();
          this.lazyLoadCollections();

          if (manageLoader) {
            this.hideLoader();
          }

          this.$nextTick(function(){
            $('[data-toggle="tooltip"]').tooltip();

            $('.mbs-content-row').scroll(function() {
               if($('.mbs-content-row').scrollTop() + $('.mbs-content-row').innerHeight() >= $(this)[0].scrollHeight) {
                 vm.lazyLoadCollections();

               }
            });

          });

        });

      },
      fetchCollectionsAndBooks: function(){

        this.showLoader();
        this.fetchCollections(false);

        this.$http.get('/api/books_collection/', function(books){
          this.allBooks = books;

          this.hideLoader();
        });

      },
      onSubmitCollection: function(e){
        e.preventDefault();

        var collection = this.theCollection;

        // clearing information on the modal
        this.clearArrays();
        this.theCollection = { id: '', name: '', books: [], modaltitle: 'New Collection' };

        // saving to db
        this.$http.post('/api/setCollection', collection, function(){
          // refreshing collections
          this.fetchCollections(true);

        });
        $('#addModal').modal('hide');

      },
      addCollection: function(){
        // clearing information on the modal
        this.clearArrays();
        this.theCollection = { id: '', name: '', books: [], modaltitle: 'New Collection' };
        $('#addModal').modal('show');
      },
      bookCount: function(books){
        alert(books.length);
        return books.length;
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
      collectionIsNotFilled: function(){
        if(!this.theCollection.name){
          return true;
        }

        return false;
      }
    },

    // events
    events: {
      'add-item': function(){
        this.addCollection();
      },
      'collection-delete': function(id){
        var info = { id: id };
        this.$http.post('/api/deleteCollection/', info, function(){
          $('.mbs-book-collection[data-id="'+id+'"]').fadeOut().remove();
        });

      },
      'collection-edit': function(id) {
        var info = { id: id };
        var that = this;
        this.$http.get('/api/getCollection/'+id, function(collection){
          if(!collection){
            swal('Mmmmh', 'It seems I can\'t find any information related to this collection', 'Error');
            return;
          }

          this.theCollection = { id: collection.id, name: collection.name, books: collection.books, modaltitle: 'Edit Collection' };
          $('#addModal').modal('show');

        });
      }
    }

});
