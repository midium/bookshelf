
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
      sortField: 'name'
    },
    {
        name: 'bcount',
        title: 'Books',
        sortField: 'bcount',
        titleClass: 'text-center',
        dataClass: 'text-center',
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
    el: '#genres',

    // data setup
    data: {
      fields: tableColumns,
      searchFor: '',
      paginationInfoTemplate: 'Displaying {from} to {to} of {total} items',
      itemActions: [
          { name: 'edit-item', label: '', icon: 'icon-Pen', class: 'btn btn-xs', title:'Edit Genre'},
          { name: 'delete-item', label: '', icon: 'icon-Bin', class: 'btn btn-xs', title:'Edit Genre'},
          { name: 'books-item', label: '', icon: 'glyphicon glyphicon-book', class: 'btn btn-xs', title:'Genre\'s Books'}
      ],
      newGenre: {
        'id': '',
        'name': '',
        'bcount': '',
        'modaltitle': 'New Genre'
      },
      moreParams: [],
      searchPerformed: false,
    },

    // what to do once the page load at first
    ready: function(){
    },

    // computations used to show/hide enable/disable controls
    computed: {
      genreIsNotFilled: function(){
        var result = false;
        for(var key in this.newGenre){
          if (! this.newGenre[key] && key != 'bcount' && key != 'id') result = true;
        }

        return result;
      }
    },

    // methods
    methods: {
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
      showLoader: function(){
        $('.fullpage-mask').show();
        $('.fullpage-loader').show();
      },
      hideLoader: function(){
        $('.fullpage-mask').hide();
        $('.fullpage-loader').hide();
      },
      onSubmitGenre: function(e){
        e.preventDefault();

        var genre = this.newGenre;

        // clearing information on the modal
        this.newGenre = { id: '', name: '' , modaltitle: 'New Genre'};

        // saving to db
        this.$http.post('/api/setGenre', genre);

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
      addGenre: function(e){
        e.preventDefault();
        this.newGenre = { id: '', name: '' , modaltitle: 'New Genre'};
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
             this.newGenre = { id: data.id, name: data.name , modaltitle: 'Edit Genre'}

             $('#addModal').modal('show');

         } else if (action == 'delete-item') {
           swal({
            title: 'Are you sure?',
            text: "You are about to remove this genre, you won't be able to revert this!",
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
              that.$http.post('/api/deleteGenre', info);

              // requiring table update
              that.$broadcast('vuetable:reload');
            }
          });
        } else if (action == 'books-item') {
          window.location.href = "/genre/books/"+data.id;
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
