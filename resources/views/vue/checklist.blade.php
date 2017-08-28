<template id="checklist-control-template">
  <div v-if="search" class="chklist chklist-searchbox">
    <input type="text" placeholder="Search" v-model="searchText" class="form-control" autocomplete="off" />
  </div>
  <ul class="list-group list-left chklist chklist-box">
    <li class="list-group-item chklist chklist-@{{getStatus(item)}}" v-for="item in availableItems | filterBy searchText" @click="select(item)">
      <span class="state-icon glyphicon glyphicon-@{{getStatus(item)}}"></span>
      @{{item.label}}
    </li>
  </ul>
</template>
