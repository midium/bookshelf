// registering controls
Vue.component('my-book-read', MyBookRead);
Vue.component('my-header', MyHeader);

var vm = new Vue({
    el: '#reads',

    // data setup
    data: {
      theBook: {
        'id': '',
        'title': '',
        'reads': [],
      },
      book_id: '',
      allStatuses: '',
    },

    // what to do once the page load at first
    ready: function(){
      this.fetchBookReads();
    },

    // methods
    methods: {
      deleteRead: function(id){
        var info = { id: id };
        this.$http.post('/api/deleteBookRead/', info, function(){
          $('.row[data-id="'+id+'"]').fadeOut().remove();
        });

      },
      submitRead: function(data, comp_ref){
        this.showLoader();
        this.$http.post('/api/setBookRead', data, function(response){

          this.hideLoader();

          if(response.success === true && comp_ref !== null){
            comp_ref.setReadId(response.value);
          }

        });
      },
      newRead: function(e){
        var newComp = new MyBookRead();
        newComp.statuses =  this.allStatuses;
        newComp.readStatus =  1;
        newComp.showDelete = false;
        newComp.showClear = true;
        newComp.bookId = this.theBook.id;

        newComp.$on('delete-read', function(id){
          vm.deleteRead(id);
        });
        newComp.$on('submit-read', function(data){
          vm.submitRead(data, newComp);
        });

        newComp.$mount().$before('.new-read');
      },
      showLoader: function(){
        $('.fullpage-mask').show();
        $('.fullpage-loader').show();
      },
      hideLoader: function(){
        $('.fullpage-mask').hide();
        $('.fullpage-loader').hide();
      },
      fetchBookReads: function(){
        this.showLoader();

        this.fetchStatuses();

        var id = this.book_id;
        this.$http.get('/api/bookReads/'+id, function(reads){

          this.theBook.id = reads.id;
          this.theBook.title = reads.title;
          this.theBook.reads = reads.reads;

          this.hideLoader();

        });
      },
      fetchStatuses: function(){
        this.$http.get('/api/statuses/', function(statuses){
          this.$set('statuses', statuses);
          this.allStatuses = statuses;
          this.hideLoader();
        });
      }
    },

    // components events
    events: {
      'delete-read': function(id){
        this.deleteRead(id);
      },
      'submit-read': function(data){
        this.submitRead(data, null);
      }
    }

});
