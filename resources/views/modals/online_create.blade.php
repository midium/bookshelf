<div class="modal fade" id="onlineModal" tabindex="-1" role="dialog" aria-labelledby="BookModal">
  <div class="modal-dialog modal-lg" role="document">
    <form v-on:submit="onSubmitBook" method="post">
      <!--<input type="hidden" class="form-control" id="id" name="id" v-model="modalData.id">-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="exampleModalLabel">@{{modalData.modaltitle}}</h4>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label for="title" class="control-label">
                  Title:
                  <span class="error" v-if="! modalData.title">*</span>
                </label>
                <input type="text" class="form-control" id="title" name="title" v-model="modalData.title">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="new_publisher" v-model="newPublisher"/> <strong>New Publisher:</strong>
                  </label>
                </div>
                <input type="text" v-model="modalData.publisher" class="form-control"/>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="use_publisher" v-model="usePublisher"/> <strong>Similar Publisher:</strong>
                  </label>
                </div>
                <my-found-publishers :value.sync="similarSelections.publisher_id" :options="correspondingPublishers" :search="true" :close-on-select="true"></my-found-publishers>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="custom_publisher" v-model="customPublisher"/> <strong>Custom Selection:</strong>
                  </label>
                </div>
                <my-publishers :value.sync="customSelections.publisher_id" :options="publishers" :search="true" :close-on-select="true"></my-publishers>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="new_author" v-model="newAuthor"/> <strong>New Author(s):</strong>
                  </label>
                </div>
                <div class="form-group">
                  <input type="text" v-model="modalData.authors" class="form-control"/>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="use_author" v-model="useAuthor"/> <strong>Similar Author(s):</strong>
                  </label>
                </div>
                <my-found-authors :value.sync="similarSelections.authors" :options="correspondingAuthors" :search="true" multiple></my-found-authors>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="custom_author" v-model="customAuthor"/> <strong>Custom Selection:</strong>
                  </label>
                </div>
                <my-authors :value.sync="customSelections.authors" :options="authors" :search="true" :close-on-select="true"></my-authors>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="new_language" v-model="newLanguage"/> <strong>New Language(s):</strong>
                  </label>
                </div>
                <div class="form-group">
                  <input type="text" v-model="modalData.languages" class="form-control"/>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="use_language" v-model="useLanguage"/> <strong>Similar Language(s):</strong>
                  </label>
                </div>
                <my-found-languages :value.sync="similarSelections.languages" :options="correspondingLanguages" :search="true" multiple></my-found-languages>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="custom_language" v-model="customLanguage"/> <strong>Custom Selection:</strong>
                  </label>
                </div>
                <my-languages :value.sync="customSelections.languages" :options="languages" :search="true" :close-on-select="true"></my-languages>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="use_year" v-model="useYear"/> <strong>Year:</strong>
                  </label>
                </div>
                <input type="number" class="form-control" id="year" name="year" v-model="modalData.year">
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="use_isbn" v-model="useIsbn"/> <strong>ISBN:</strong>
                  </label>
                </div>
                <input type="text" class="form-control" id="isbn" name="isbn" v-model="modalData.isbn">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="use_description" v-model="useDescription"/> <strong>Description:</strong>
                  </label>
                </div>
                <textarea v-model="modalData.description" id="description" name="description" class="form-control" rows="4"></textarea>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="use_cover" v-model="useCover"/> <strong>Downloaded Cover:</strong>
                  </label>
                </div>
                <div>
                  <img src="@{{ modalData.cover }}" class="img-responsive img-thumbnail mbs mbs-found-cover" />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <div class="checkbox">
                  <label>
                    <input type="checkbox" id="custom_cover" v-model="customCover"/> <strong>Custom Cover:</strong>
                  </label>
                </div>
                <my-uploader :image-src="@{{ customSelections.cover }}"></my-uploader>
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
