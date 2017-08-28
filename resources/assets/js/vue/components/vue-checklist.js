var MyChecklist = Vue.extend({
  template: '#checklist-control-template',
  props:{
    items: {
      type: Array,
      default() { return [] },
    },
    selectedItems: {
      type: Array,
      default() { return [] },
    },
    blackList: {
      type: Array,
      default() { return [] },
    },
    search: { // Allow searching (only works when options are provided)
    	type: Boolean,
      coerce: this.coerceBoolean,
    	default: false
    },
    multiple: {
      type: Boolean,
      coerce: this.coerceBoolean,
      default: false
    },
  },
  data: {
    searchText: null
  },
  methods: {
    coerceBoolean: function(val){
      return (typeof val !== "string" ? val :
        val === "true" ? true :
        val === "false" ? false :
        val === "null" ? false :
        val === "undefined" ? false : val);
    },
    getStatus(v) {
      if(this.isSelected(v)){
        return 'check';
      }

      return 'unchecked';
    },
    select(v) {
        if (this.selectedItems.indexOf(v) === -1) {
          if (this.multiple) {
            this.selectedItems.push(v)
          } else {
            this.selectedItems = [v]
          }
        } else {
          if (this.multiple) {
            this.selectedItems.$remove(v)
          }
        }
    },
    isSelected(v) {
      if (this.selectedItems.constructor !== Array) {
        return this.selectedItems == v
      } else {
        return this.selectedItems.indexOf(v) !== -1
      }
    },
    isBlackListed: function(item){
      if(this.blackList.length > 0) {
        for (var bitem of this.blackList) {
          if(item.value == bitem.value){
            return true;
          }
        }
      }

      return false;
    }
  },
  computed: {
    showPlaceholder() {
      return this.selectedItems.length === 0
    },
    availableItems: function(){
      let result = [];
      for (var item of this.items) {
        if(!this.isBlackListed(item)){
          result.push(item);
        }
      }

      return result;
    }
  },
});
