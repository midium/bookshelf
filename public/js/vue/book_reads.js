"use strict";

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('#token').getAttribute('value');

var MySelector = Vue.extend({
  template: '#selector-control-template',
  props: {
    options: {
      type: Array,
      default() { return [] },
    },
    value: {
      twoWay: true
    },
    placeholder: {
      type: String,
      default: 'Nothing Selected'
    },
    multiple: {
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    search: { // Allow searching (only works when options are provided)
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1024
    },
    closeOnSelect: { // only works when multiple==false
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
    disabled: {
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    }
  },
  ready() {
    if (this.value.constructor !== Array) {
      if (this.value.length === 0) {
        this.value = []
      } else {
        this.value = [this.value]
      }
    } else {
      if (!this.multiple && this.value.length > 1) {
        this.value = this.value.slice(0, 1)
      } else if (this.multiple && this.value.length > this.limit) {
        this.value = this.value.slice(0, this.limit)
      }
    }
  },
  data() {
    return {
      searchText: null,
      show: false,
      showNotify: false
    }
  },
  computed: {
    selectedItems: function() {
      let foundItems = [];
      if (this.value.length) {
        for (var item of this.value) {
          if (this.options.length === 0)
          {
            foundItems = this.value;
          }
          else
          {
              let option
              this.options.some(o => {
                if(o.value === item) {
                  option = o
                  return true
                }
              })
              option && foundItems.push(option.label)
          }
        }
      } else if(this.value != 0) {
        if (this.options.length === 0)
        {
          foundItems = this.value;
        }
        else
        {
          let option
          this.options.some(o => {
            if(o.value === this.value) {
              option = o
              return true
            }
          })
          option && foundItems.push(option.label)
        }
      }
      return foundItems.join(', ')

    },
    showPlaceholder: function() {
      return this.value.length === 0
    }
  },
  watch: {
    value(val) {
      if (val.length > this.limit) {
        this.showNotify = true
        this.value.pop()
        setTimeout(() => this.showNotify = false, 1000)
      }
    }
  },
  methods: {
    coerceBoolean: function(val){
      return (typeof val !== "string" ? val :
        val === "true" ? true :
        val === "false" ? false :
        val === "null" ? false :
        val === "undefined" ? false : val);
    },
    select: function(v) {
        if (this.value.constructor === Array && this.value.indexOf(v) === -1) {
          if (this.multiple) {
            this.value.push(v)
          } else {
            this.value = [v]
            this.$dispatch('selection-changed', this.value);
          }
        } else {
          if (this.multiple) {
            this.value.$remove(v)
          } else {
            this.value = [v]
            this.$dispatch('selection-changed', this.value);
          }
        }
        if (this.closeOnSelect) {
          this.toggleDropdown()
        }
    },
    isSelected: function(v) {
      if (this.value.constructor !== Array) {
        return this.value == v
      } else {
        return this.value.indexOf(v) !== -1
      }
    },
    toggleDropdown: function() {
      this.show = !this.show
    }
  },
  events: {
    'clear-selection-search': function(){
      this.searchText = '';
    }
  }
});

var MyBookRead = Vue.extend({
  template: '#book-read-component-template',
  components: {
    'my-selector': MySelector,
  },
  props:{
    bookId:{
      type: Number,
      twoWay: true,
      default() { return '' }
    },
    readStatus:{
      type: Number,
      twoWay: true,
      default() { return '' }
    },
    readStart:{
      type: String,
      twoWay: true,
      default() { return '' }
    },
    readEnd:{
      type: String,
      twoWay: true,
      default() { return '' }
    },
    readId:{
      type: Number,
      twoWay: true,
      default() { return '' }
    },
    statuses: {
      type: Array,
      default() { return [] },
    }
  },
  data() {
    return {
      showEnd: '',
      token: '',
      internalId: '',
    }
  },
  ready() {
    this.showEnd = (this.readStatus != 1);
    this.token = Math.random().toString(36).substr(2);
    this.internalId = this.readId;

    var that = this;

    this.$nextTick(function(){
      $('[data-toggle="tooltip"]').tooltip();

      $('#start_date_'+that.token).datetimepicker({
        format: 'YYYY-MM-DD'
      });
      $('#end_date_'+that.token).datetimepicker({
          useCurrent: false,
          format: 'YYYY-MM-DD'
      });
      $("#start_date_"+that.token).on("dp.change", function (e) {
        $('#end_date_'+that.token).data("DateTimePicker").minDate(e.date);
      });
      $("#end_date_"+that.token).on("dp.change", function (e) {
          $('#start_date_'+that.token).data("DateTimePicker").maxDate(e.date);
      });

    });

  },
  methods: {
    setReadId: function(val){
      this.internalId = val;
      $("#id_"+this.token).val(val);
      $("#main_"+this.token).attr('data-id', val);
    },
    coerceBoolean: function(val){
      return (typeof val !== "string" ? val :
        val === "true" ? true :
        val === "false" ? false :
        val === "null" ? false :
        val === "undefined" ? false : val);
    },
    deleteRead: function(e) {
      e.preventDefault();

      var that = this;

      swal({
       title: 'Are you sure?',
       text: "You are about to remove this book read, you won't be able to revert this!",
       type: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes, delete it!'
     }).then(function(isConfirm) {
       if (isConfirm) {
         that.$dispatch('delete-read', that.readId);
       }
     })
    },
    submitRead: function(e) {
      e.preventDefault();
      this.$dispatch('submit-read', { id: this.internalId, status: this.readStatus, start: this.readStart, end: this.readEnd, book_id: this.bookId } );
    },
  },
  events: {
    'selection-changed': function(val){
      this.currentStatus = this.readStatus;
      this.showEnd = (this.readStatus != 1);
    },
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

//# sourceMappingURL=book_reads.js.map
