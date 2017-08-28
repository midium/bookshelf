"use strict";

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('#token').getAttribute('value');

/**
 * Pagination Mixin
 */
var paginationMixin = {
    props: {
         'wrapperClass': {
            type: String,
            default: function() {
                return 'ui right floated pagination menu'
            }
        },
        'activeClass': {
            type: String,
            default: function() {
                return 'active large'
            }
        },
        'disabledClass': {
            type: String,
            default: function() {
                return 'disabled'
            }
        },
        'pageClass': {
            type: String,
            default: function() {
                return 'item'
            }
        },
        'linkClass': {
            type: String,
            default: function() {
                return 'icon item'
            }
        },
        'icons': {
            type: Object,
            default: function() {
                return {
                    first: 'angle double left icon',
                    prev: 'left chevron icon',
                    next: 'right chevron icon',
                    last: 'angle double right icon',
                }
            }
        },
        'onEachSide': {
            type: Number,
            coerce: function(value) {
                return parseInt(value)
            },
            default: function() {
                return 2
            }
        },
    },
    data: function() {
        return {
            tablePagination: null
        }
    },
    computed: {
        totalPage: function() {
            return this.tablePagination == null
                ? 0
                : this.tablePagination.last_page
        },
        isOnFirstPage: function() {
            return this.tablePagination == null
                ? false
                : this.tablePagination.current_page == 1
        },
        isOnLastPage: function() {
            return this.tablePagination == null
                ? false
                : this.tablePagination.current_page == this.tablePagination.last_page
        },
        notEnoughPages: function() {
            return this.totalPage < (this.onEachSide * 2) + 4
        },
        windowSize: function() {
            return this.onEachSide * 2 +1;
        },
        windowStart: function() {
            if (this.tablePagination.current_page <= this.onEachSide) {
                return 1
            } else if (this.tablePagination.current_page >= (this.totalPage - this.onEachSide)) {
                return this.totalPage - this.onEachSide*2
            }

            return this.tablePagination.current_page - this.onEachSide
        },
    },
    methods: {
        loadPage: function(page) {
            this.$dispatch('vuetable-pagination:change-page', page)
        },
        isCurrentPage: function(page) {
            return page == this.tablePagination.current_page
        }
    },
    events: {
        'vuetable:load-success': function(tablePagination) {
            this.tablePagination = tablePagination
        },
        'vuetable-pagination:set-options': function(options) {
            for (var n in options) {
                this.$set(n, options[n])
            }
        }
    },
}

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

//# sourceMappingURL=genres.js.map
