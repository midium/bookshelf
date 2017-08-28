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
