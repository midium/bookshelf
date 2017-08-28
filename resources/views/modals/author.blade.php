<div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="AuthorModal">
  <div class="modal-dialog" role="document">
    <form v-on:submit="onSubmitAuthor" method="post" enctype="multipart/form-data">
      <input type="hidden" class="form-control" id="id" name="id" v-model="newAuthor.id">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="exampleModalLabel">@{{newAuthor.modaltitle}}</h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Name:
              <span class="error" v-if="! newAuthor.name">*</span>
            </label>
            <input type="text" class="form-control" id="name" name="name" v-model="newAuthor.name">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Website:
            </label>
            <input type="website" class="form-control" id="website" name="website" v-model="newAuthor.website">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Email:
            </label>
            <input type="email" class="form-control" id="email" name="email" v-model="newAuthor.email">
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="recipient-name" class="control-label">
                  Birth:
                </label>
                <input type="text" class="form-control" id="birth" name="birth" v-model="newAuthor.birth">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="recipient-name" class="control-label">
                  Death:
                </label>
                <input type="text" class="form-control" id="death" name="death" v-model="newAuthor.death">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="recipient-name" class="control-label">
              Nationality:
            </label>
            <select class="form-control" id="nationality_id" name="nationality_id" v-model="newAuthor.nationality_id">
              <option v-for="nation in nationalities" value="@{{ nation.id }}" >@{{ nation.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="avatar" class="contro-label">
              Photo:
            </label>
            <my-uploader :image-src="@{{ newAuthor.avatar }}"></my-uploader>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Abort</button>
          <button type="submit" class="btn btn-primary" v-bind:disabled="authorIsNotFilled">Save</button>
        </div>
      </div>
    </form>
  </div>
</div>
