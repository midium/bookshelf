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
      name: 'code',
      sortField: 'code'
    },
    {
      name: 'language',
      sortField: 'language'
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

// Registering header
Vue.component('my-header', MyHeader);

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

new Vue({
    el: '#languages',

    // data setup
    data: {
      fields: tableColumns,
      paginationInfoTemplate: 'Displaying {from} to {to} of {total} items',
      itemActions: [
          { name: 'edit-item', label: '', icon: 'icon-Pen', class: 'btn btn-xs', title:'Edit Language'},
          { name: 'delete-item', label: '', icon: 'icon-Bin', class: 'btn btn-xs', title:'Delete Language'},
          { name: 'books-item', label: '', icon: 'glyphicon glyphicon-book', class: 'btn btn-xs', title:'Language\'s Books'}
      ],
      newLanguage: {
        'id': '',
        'code': '',
        'language': '',
        'bcount': '',
        'modaltitle': ''
      }
    },

    // what to do once the page load at first
    ready: function(){
    },

    // computations used to show/hide enable/disable controls
    computed: {
      languageIsNotFilled: function(){
        var result = false;
        for(var key in this.newLanguage){
          if (! this.newLanguage[key] && key != 'bcount' && key != 'id') result = true;
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
      onSubmitLanguage: function(e){
        e.preventDefault();

        var language = this.newLanguage;

        // clearing information on the modal
        this.newLanguage = { id: '', code: '', language: '', modaltitle: 'New Language' };

        // saving to db
        this.$http.post('/api/setLanguage', language);

        // requiring table update
        this.$broadcast('vuetable:reload');

        $('#addModal').modal('hide');
      },
      addLanguage: function(e){
        e.preventDefault();
        this.newLanguage = { id: '', code: '', language: '', modaltitle: 'New Language' };
        $('#addModal').modal('show');
      }
    },

    events: {
      'vuetable:action': function(action, data) {
        var that = this;
         if (action == 'edit-item') {
             this.newLanguage = { id: data.id, code: data.code, language: data.language, modaltitle: 'Edit Language'}

             $('#addModal').modal('show');

         } else if (action == 'delete-item') {
           swal({
            title: 'Are you sure?',
            text: "You are about to remove this language, you won't be able to revert this!",
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
              that.$http.post('/api/deleteLanguage', info);

              // requiring table update
              that.$broadcast('vuetable:reload');
            }
          })
        } else if (action == 'books-item') {
          window.location.href = "/language/books/"+data.id;
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
      }
    }
});
