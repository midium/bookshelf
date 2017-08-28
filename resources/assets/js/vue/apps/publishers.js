// fields definition
var tableColumns = [
  {
    name: 'id',
    sortField: 'id',
    titleClass: '_id',
    dataClass: '_id',
    visible: false
  },
    {
      name: 'name',
      sortField: 'name',
      titleClass: 'ten-percent-size',
      dataClass: 'ten-percent-size',
    },
    {
      name: 'website',
      callback: 'webLink',
      sortField: 'website',
      titleClass: 'fixed-size',
      dataClass: 'fixed-size',
    },
    {
      name: 'email',
      callback: 'emailLink',
      sortField: 'email',
      titleClass: 'thirty-percent-size',
      dataClass: 'thirty-percent-size',
    },
    {
        name: 'nation',
        title: 'Nat',
        callback: 'nationFlag',
        sortField: 'nation',
        titleClass: 'text-center ten-percent-size',
        dataClass: 'text-center ten-percent-size',
    },
    {
        name: 'bcount',
        title: 'Books',
        sortField: 'bcount',
        titleClass: 'text-center ten-percent-size',
        dataClass: 'text-center ten-percent-size',
    },
    {
        name: '__actions',
        dataClass: 'center aligned'
    }
];

// create pagination component using bootstrap styling
Vue.component('vuetable-pagination-bootstrap', {
    template: '#vuetable-pagination-bootstrap-template',
    mixins: [paginationMixin],
    methods: {
        loadPage: function(page) {
            this.$dispatch('vuetable-pagination:change-page', page)
        },
    },
});

Vue.component('my-header', MyHeader);

new Vue({
    el: '#publishers',

    // data setup
    data: {
      fields: tableColumns,
      searchFor: '',
      paginationInfoTemplate: 'Displaying {from} to {to} of {total} items',
      itemActions: [
        { name: 'edit-item', label: '', icon: 'icon-Pen', class: 'btn btn-xs', title:'Edit Publisher'},
        { name: 'delete-item', label: '', icon: 'icon-Bin', class: 'btn btn-xs', title:'Delete Publisher'},
        { name: 'books-item', label: '', icon: 'glyphicon glyphicon-book', class: 'btn btn-xs', title:'Publisher\'s Books'}
      ],
      newPublisher: {
        'id': '',
        'name': '',
        'website': '',
        'email': '',
        'nationality_id': '',
        'nationality': '',
        'modaltitle': 'New Publisher'
      },
      moreParams: [],
      searchPerformed: false,
    },

    // what to do once the page load at first
    ready: function(){
      this.fetchNationalities();
    },

    // computations used to show/hide enable/disable controls
    computed: {
      publisherIsNotFilled: function(){
        if (! this.newPublisher['name']) return true;

        return false;
      }
    },

    // methods
    methods: {
      fetchNationalities: function(){
        this.$http.get('/api/nationalities', function(nationalities){
          this.$set('nationalities', nationalities);
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
      /**
       * Vue table Callback functions
       */
      webLink: function(value) {
        return '<a href="'+value+'">'+value+'</a>'
      },
      emailLink: function(value) {
        return '<a href="mailto:'+value+'">'+value+'</a>'
      },
      nationFlag: function(value) {
        return '<i class="mbs '+value+' flag"></i>'
      },
      onSubmitPublisher: function(e){
        e.preventDefault();

        var publisher = this.newPublisher;

        // clearing information on the modal
        this.newPublisher = { id: '', name: '', website: '', email: '', nationality_id: '', modaltitle: 'New Publisher' };

        // saving to db
        this.$http.post('/api/setPublisher', publisher);

        // requiring table update
        this.$broadcast('vuetable:reload');

        $('#addModal').modal('hide');
      },
      setFilter: function(){
        this.moreParams = [
            'filter=' + this.searchFor
        ]
        this.$nextTick(function() {
          this.$broadcast('vuetable:refresh')
        })
      },
      cleanFilter: function(e){
        e.preventDefault();
        this.searchFor = '';
        this.moreParams = [];
        this.$nextTick(function() {
          this.$broadcast('vuetable:refresh');
          this.$broadcast('search-cleared');
        })
      },
      addPublisher: function(e){
        e.preventDefault();
        this.newPublisher = { id: '', name: '', website: '', email: '', nationality_id: '', modaltitle: 'New Publisher' };

        $('#addModal').modal('show');

      }
    },

    events: {
      'set-filter': function(textToSearch){
        this.searchFor = textToSearch;
        this.setFilter();
      },
      'vuetable:action': function(action, data) {
        var that = this;
         if (action == 'edit-item') {
             this.newPublisher = { id: data.id, name: data.name, website: data.website, email: data.email, nationality_id: data.nationality_id, modaltitle: 'Edit Publisher' }

             $('#addModal').modal('show');

         } else if (action == 'delete-item') {
           swal({
            title: 'Are you sure?',
            text: "You are about to remove this publisher, you won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(function(isConfirm) {
            if (isConfirm) {
              // collecting data to send
              var info = { id: data.id };

              // removing the language
              that.$http.post('/api/deletePublisher', info);

              // requiring table update
              that.$broadcast('vuetable:reload');
            }
          })
        } else if (action == 'books-item') {
          window.location.href = "/publisher/books/"+data.id;
        }
      },
      'vuetable:load-error': function(response) {
        console.log('load-error: ', response)
      },
      'vuetable:loading': function() {
        this.showLoader();
      },
      'vuetable:loaded': function() {
        this.hideLoader();
        if(this.searchFor) {
          this.searchPerformed = true;
        } else {
          this.searchPerformed = false;
        }
      }
    }
});
