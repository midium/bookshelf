var MyBook = Vue.extend({
  template: '#book-card-template',
  props: {
    myBook: {
      default: null
    },
    showDetails: { // Allow to hide details tooltip, default hide
      type: Boolean,
      coerce: this.coerceBoolean,
      default: true
    },
    hasTools: { // Show/hide tools, default shown
      type: Boolean,
      coerce: this.coerceBoolean,
      default: true
    },
    allowEdit: { // Show/hide edit tools (if hasTools is false, then this will be hidden in any case), default shown
      type: Boolean,
      coerce: this.coerceBoolean,
      default: true
    },
    allowDelete: { // Show/hide delete tools (if hasTools is false, then this will be hidden in any case), default shown
      type: Boolean,
      coerce: this.coerceBoolean,
      default: true
    },
    howManyOnRow: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      book_id: '',
      flipped_card: false,
    }
  },
  methods: {
    cardFlip: function(){
      this.flipped_card = !this.flipped_card;
    },
    coerceBoolean: function(val){
      return (typeof val !== "string" ? val :
        val === "true" ? true :
        val === "false" ? false :
        val === "null" ? false :
        val === "undefined" ? false : val);
    },
    columnWidth: function(){
      if(this.howManyOnRow){
        return '' + (12 / this.howManyOnRow);
      }

      return '3';
    },
    deleteBook: function(e){
      e.preventDefault();

      var that = this;

      swal({
       title: 'Are you sure?',
       text: "You are about to remove this book, you won't be able to revert this!",
       type: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes, delete it!'
     }).then(function(isConfirm) {
       if (isConfirm) {
         that.$dispatch('book-delete', that.book_id);
       }
     })
   },
   editBook: function(e) {
     e.preventDefault();

     this.$dispatch('book-edit', this.book_id);
   }
  }
});
