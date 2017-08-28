<div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
  <div class="modal-dialog" role="document">
    <form v-on:submit="onSubmitGenre" method="post">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="exampleModalLabel">@{{newGenre.modaltitle}}</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Name:
              <span class="error" v-if="! newGenre.name">*</span>
            </label>
            <input type="text" class="form-control" id="name" name="name" v-model="newGenre.name">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Abort</button>
          <button type="submit" class="btn btn-primary" v-bind:disabled="genreIsNotFilled">Save</button>
        </div>
      </div>
    </form>
  </div>
</div>
