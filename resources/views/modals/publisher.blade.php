<div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
  <div class="modal-dialog" role="document">
    <form v-on:submit="onSubmitPublisher" method="post">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="exampleModalLabel">@{{newPublisher.modaltitle}}</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Name:
              <span class="error" v-if="! newPublisher.name">*</span>
            </label>
            <input type="text" class="form-control" id="name" name="name" v-model="newPublisher.name">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Website:
            </label>
            <input type="website" class="form-control" id="website" name="website" v-model="newPublisher.website">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Email:
            </label>
            <input type="email" class="form-control" id="email" name="email" v-model="newPublisher.email">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Nationality:
            </label>
            <select class="form-control" id="nationality_id" name="nationality_id" v-model="newPublisher.nationality_id">
              <option v-for="nation in nationalities" value="@{{ nation.id }}" >@{{ nation.name }}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Abort</button>
          <button type="submit" class="btn btn-primary" v-bind:disabled="publisherIsNotFilled">Save</button>
        </div>
      </div>
    </form>
  </div>
</div>
