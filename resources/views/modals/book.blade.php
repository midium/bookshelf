<div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="BookModal">
  <div class="modal-dialog modal-lg" role="document">
    <form v-on:submit="onSubmitBook" method="post" enctype="multipart/form-data">
      <input type="hidden" class="form-control" id="id" name="id" v-model="newBook.id">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="exampleModalLabel">@{{newBook.modaltitle}}</h4>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="title" class="control-label">
                  Title:
                  <span class="error" v-if="! newBook.title">*</span>
                </label>
                <input type="text" class="form-control" id="title" name="title" v-model="newBook.title">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="original_title" class="control-label">
                  Original Title:
                </label>
                <input type="text" class="form-control" id="original_title" name="original_title" v-model="newBook.original_title">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="pages" class="control-label">
                  Pages:
                </label>
                <input type="number" class="form-control" id="pages" name="pages" v-model="newBook.pages">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="year" class="control-label">
                  Year:
                </label>
                <input type="number" class="form-control" id="year" name="year" v-model="newBook.year">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="vote" class="control-label">
                  Vote:
                </label>
                <div class="form-group">
                  <input type="hidden" class="rating add-edit-rating" v-model="newBook.vote" id="vote" name="vote" data-filled="glyphicon glyphicon-star-empty mbs-rating-symbol mbs-symbol-filled" data-empty="glyphicon glyphicon-star-empty mbs-rating-symbol"/>
                  <a @click="clearVote" class="btn btn-xs btn-default mbs-rate-clear" data-toggle="tooltip" data-placement="top" title="Clear Vote"><i class="glyphicon glyphicon-erase"></i></a>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="isbn" class="control-label">
                  ISBN:
                </label>
                <input type="text" class="form-control" id="isbn" name="isbn" v-model="newBook.isbn">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="publisher" class="control-label">
                  Publisher:
                </label>
                <my-publishers :value.sync="newBook.publisher_id" :options="publishers" :search="true" :close-on-select="true"></my-publishers>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="authors" class="control-label">
                  Author(s):
                </label>
                <div class="form-group">
                  <my-authors :value.sync="newBook.authors" :options="authors" :search="true" multiple></my-authors>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label for="genres" class="control-label">
                  Genre(s):
                </label>
                <div class="form-group">
                  <my-genres :value.sync="newBook.genres" :options="genres" :search="true" multiple></my-genres>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="languages" class="control-label">
                  Language(s):
                </label>
                <div class="form-group">
                  <my-languages :value.sync="newBook.languages" :options="languages" :search="true" multiple></my-languages>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label for="collections" class="control-label">
                  Collection(s):
                </label>
                <div class="form-group">
                  <my-collections :value.sync="newBook.collections" :options="collections" :search="true" multiple></my-collections>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              &nbsp;
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="collections" class="control-label">
                  Description:
                </label>
                <textarea v-model="newBook.description" id="description" name="description" class="form-control" rows="9">
                </textarea>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="cover" class="control-label">
                  Cover:
                </label>
                <my-uploader :image-src="@{{ newBook.cover }}"></my-uploader>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Abort</button>
          <button type="submit" class="btn btn-primary" v-bind:disabled="bookIsNotFilled">Save</button>
        </div>
      </div>
    </form>
  </div>
</div>
