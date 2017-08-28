<template id="book-read-component-template">
<div class="row no-margin" id="main_@{{token}}" data-id="@{{readId}}">
  <form @submit="submitRead">
    <div class="row">
      <input type="hidden" name="id" id="id_@{{token}}" value="@{{readId}}" v-model="readId" />
      <input type="hidden" name="book_id" value="@{{bookId}}" v-model="bookId" />
      <div class="col col-md-3">
        <div class="form-group">
          <label for="status">Read Status:</label>
          <my-selector :value.sync="readStatus" :options="statuses" :close-on-select="true"></my-selector>
        </div>
      </div>
      <div class="col col-md-3">
        <div class="form-group">
          <label for="start">Start Date:</label>
          <input type="text" class="form-control" id="start_date_@{{token}}" name="start_date" v-model="readStart" value="@{{readStart}}" />
        </div>
      </div>
      <div class="col col-md-3" v-show="showEnd" >
        <div class="form-group">
          <label for="end">End Date:</label>
          <input type="text" class="form-control" id="end_date_@{{token}}" name="end_date" v-model="readEnd" value="@{{readEnd}}" />
        </div>
      </div>
      <div class="col col-md-3">
        <div class="form-group">
          <button class="btn btn-default btn-sm mbs mbs-reads-tool" type="submit" data-toggle="tooltip" data-placement="left" title="Save">
            <i class="glyphicon glyphicon-floppy-disk"></i>
          </button>
          <button class="btn btn-default btn-sm mbs mbs-reads-tool" type="button" data-toggle="tooltip" data-placement="right" title="Delete" @click="deleteRead" :disabled="!internalId">
            <i class="glyphicon glyphicon-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
</template>
