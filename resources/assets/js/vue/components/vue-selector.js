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
