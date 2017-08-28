var MyAddressBar = Vue.extend({
  template: '#addresstab',
  props: {
      'selectedLetter': {
          type: String,
          twoWay: true,
          default: ''
      }
  },
  ready: function(){
    this.dispatchEvent('letterChanged', this.selectedLetter);
  },
  methods: {
      isActive: function(str) {
          if (this.selectedLetter == str) {
              return 'active'
          }
          return ''
      },
      dispatchEvent: function(eventName, args) {
          this.$dispatch(eventName, args)
      },
      letterChanged: function(str) {
        this.selectedLetter = str;
        this.dispatchEvent('letter-changed', str)
      },
  },
  events: {
    setLetter: function(str) {
      this.selectedLetter = str;
      this.dispatchEvent('letterChanged', str);
    }

  }

});
