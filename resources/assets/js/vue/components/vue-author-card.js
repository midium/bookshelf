var MyAuthor = Vue.extend({
  template: '#author-card-template',
  props: ['myAuthor'],
  data: {
    author_id: ''
  },
  methods: {
    deleteAuthor: function(e){
      e.preventDefault();

      var that = this;

      swal({
       title: 'Are you sure?',
       text: "You are about to remove this author, you won't be able to revert this!",
       type: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes, delete it!'
     }).then(function(isConfirm) {
       if (isConfirm) {
         that.$dispatch('author-delete', that.author_id);
       }
     })
   },
   editAuthor: function(e) {
     e.preventDefault();

     this.$dispatch('author-edit', this.author_id);
   }
  }
});
