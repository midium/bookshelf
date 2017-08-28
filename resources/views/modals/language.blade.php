<div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
  <div class="modal-dialog" role="document">
    <form v-on:submit="onSubmitLanguage" method="post">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="exampleModalLabel">@{{newLanguage.modaltitle}}</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Code:
              <span class="error" v-if="! newLanguage.code">*</span>
            </label>
            <input type="text" class="form-control" id="code" name="code" v-model="newLanguage.code" style="text-transform: uppercase;">
          </div>
          <div class="form-group">
            <label for="message-text" class="control-label">
              Language:
              <span class="error" v-if="! newLanguage.language">*</span>
            </label>
            <input type="text" class="form-control" id="language" name="language" v-model="newLanguage.language">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Abort</button>
          <button type="submit" class="btn btn-primary" v-bind:disabled="languageIsNotFilled">Save</button>
        </div>
      </div>
    </form>
  </div>
</div>
