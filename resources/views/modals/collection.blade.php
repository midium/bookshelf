<div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="CollectionsModal">
  <div class="modal-dialog modal-lg" role="document">
    <form v-on:submit="onSubmitCollection" method="post">
      <input type="hidden" class="form-control" id="id" name="id" v-model="theCollection.id">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="exampleModalLabel">@{{theCollection.modaltitle}}</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Name:
              <span class="error" v-if="! theCollection.name">*</span>
            </label>
            <input type="text" class="form-control" id="name" name="name" v-model="theCollection.name" required>
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col col-md-5">
                <label for="my-select" class="control-label">
                  Books on collection:
                </label>

                <my-checklist :search="true" :multiple="true" :items="theCollection.books" :selected-items="selectedOnCollection"></my-checklist>
              </div>
              <div class="col col-md-1 mbs mbs-list-arrows">
                <button type="button" class="btn btn-default btn-sm move-left" @click="addToCollection">
                    <span class="glyphicon glyphicon-chevron-left"></span>
                </button>

                <button type="button" class="btn btn-default btn-sm move-right" @click="removeFromCollection">
                    <span class="glyphicon glyphicon-chevron-right"></span>
                </button>
              </div>
              <div class="col col-md-6">
                <label for="my-select" class="control-label">
                  Available Books:
                </label>

                <my-checklist :search="true" :multiple="true" :items="allBooks" :black-list="theCollection.books" :selected-items="selectedOnAvailable"></my-checklist>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Abort</button>
          <button type="submit" class="btn btn-primary" v-bind:disabled="collectionIsNotFilled">Save</button>
        </div>
      </div>
    </form>
  </div>
</div>
