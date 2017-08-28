var MyCollection = Vue.extend({
  template: '#book-collection-template',
  props: ['myCollection'],
  data: {
    collection_id: ''
  },
  methods: {
     deleteCollection: function(e){
       e.preventDefault();

       var that = this;

       swal({
        title: 'Are you sure?',
        text: "You are about to remove this collection, you won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(function(isConfirm) {
        if (isConfirm) {
          that.dispatchEvent('collection-delete', that.collection_id);
        }
      })
     },
     dispatchEvent: function(eventName, args) {
         this.$dispatch(eventName, args)
     },
     editCollection: function(e) {
       e.preventDefault();

       this.dispatchEvent('collection-edit', this.collection_id);

     }
  }
});
