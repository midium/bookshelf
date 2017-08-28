<template id="selector-control-template">
<div class="btn-group bootstrap-select" v-bind:class="{open: show}">
  <button v-el:btn type="button" class="btn btn-default dropdown-toggle"
    @click="toggleDropdown"
    @blur="show = (search ? show : false)"
    v-bind="{disabled: disabled}"
  >
    <span class="btn-placeholder" v-show="showPlaceholder" >@{{placeholder}}</span>
    <span class="btn-content" >@{{ selectedItems }}</span>
    <span class="caret"></span>
  </button>
  <div class="dropdown-menu" v-bind:class="{open: show}">
    <div v-if="search" class="bs-searchbox">
      <input class="form-control" placeholder="Search" v-model="searchText" autocomplete="off" type="text">
    </div>
    <ul class="dropdown-menu inner">
      <template v-if="options.length">
        <li v-for="option in options | filterBy searchText " v-bind:id="option.value" style="position:relative">
          <a @mousedown.prevent="select(option.value)" style="cursor:pointer">
            @{{ option.label }}
            <span class="glyphicon glyphicon-ok check-mark" v-show="isSelected(option.value)"></span>
          </a>
        </li>
      </template>
      <slot v-else></slot>
      <div class="notify" v-show="showNotify" transition="fadein">Limit reached (@{{limit}} items max).
      </div>
    </ul>
  </div>
</div>

<style scoped>
  .bootstrap-select .btn{
    white-space: normal;
  }
  .btn-group .dropdown-menu .notify {
    position: absolute;
    bottom: 5px;
    width: 96%;
    margin: 0 2%;
    min-height: 26px;
    padding: 3px 5px;
    background: #f5f5f5;
    border: 1px solid #e3e3e3;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
     pointer-events: none;
    opacity: .9;
  }
</style>

</template>
