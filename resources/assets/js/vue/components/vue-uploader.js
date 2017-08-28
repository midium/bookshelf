var MyUploader = Vue.extend({
  template: '#uploader-template',
  data: {
    imageLoaded: 'false',
  },
  props: ['imageSrc'],
  computed: {
    isClearable: function(){
      if(this.imageLoaded == 'true') return true;

      return false;
    }
  },
  methods: {
    dispatchEvent: function(eventName, args) {
      this.$dispatch(eventName, args)
    },
    previewThumbnail: function(event) {
      var inputObj = event.target;

      if (inputObj.files && inputObj.files[0]) {
        var reader = new FileReader();

        var vm = this;

        // Listen to the load event raised by the file reader in order to show the image
        reader.onload = function(e) {
          vm.imageSrc = e.target.result;
          vm.imageLoaded = 'true';
          vm.dispatchEvent('cover-chosen', vm.imageSrc);
        }

        // making the reader load the image for real
        reader.readAsDataURL(inputObj.files[0]);

      }
    },
    clearThumbnail: function(){
    	$('#thumbnail').files = null;
      $('#thumbnail').val(null);
      this.imageSrc = '';
      this.imageLoaded = 'false';
      this.dispatchEvent('cover-clear');
    }
  },
  events: {
    'image-source': function(str){
      this.clearThumbnail();
      this.imageSrc = str;
    }
  }
});
