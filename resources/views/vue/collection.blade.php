<template id="book-collection-template">
  <div class="col col-md-3 mbs mbs-book-collection" data-id="@{{myCollection.id}}">
    <div class="mbs mbs-card-books clearfix">
      <input type="hidden" id="id" value="@{{myCollection.id}}" v-model="collection_id" />
      <div v-if="myCollection.books.length >= 3">
        <div class="mbs mbs-card-book-cover img-responsive" style="background:url(@{{myCollection.books[0]}}) no-repeat; background-size: cover;">
          <div class="overlay">
          </div>
        </div>
        <div class="mbs mbs-card-book-cover img-responsive" style="background:url(@{{myCollection.books[1]}}) no-repeat; background-size: cover;">
          <div class="overlay">
            <div class="row collection-cover">&nbsp;</div>
            <div class="row">
              <div class="col col-md-6 tools-col-6">
                <a class="no-decoration-link" @click="editCollection" href="#" data-toggle="tooltip" data-placement="top" title="Edit Collection">
                  <i class="mbs-author-tools icon-Pen">
                  </i>
                </a>
              </div>
              <div class="col col-md-6 tools-col-6">
                <a class="no-decoration-link" @click="deleteCollection" href="#" data-toggle="tooltip" data-placement="top" title="Delete Collection">
                  <i class="mbs-author-tools icon-Bin">
                  </i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="mbs mbs-card-book-cover img-responsive" style="background:url(@{{myCollection.books[2]}}) no-repeat; background-size: cover;">
          <div class="overlay">
          </div>
        </div>
      </div>
      <div v-if="myCollection.books.length == 2">
        <div class="mbs mbs-card-book-cover img-responsive" style="background:url(@{{myCollection.books[0]}}) no-repeat; background-size: cover;">
          <div class="overlay">
          </div>
        </div>
        <div class="mbs mbs-card-book-cover img-responsive" style="background:url(@{{myCollection.books[1]}}) no-repeat; background-size: cover;">
          <div class="overlay">
            <div class="row collection-cover">&nbsp;</div>
            <div class="row">
              <div class="col col-md-6 tools-col-6">
                <a class="no-decoration-link" @click="editCollection" href="#" data-toggle="tooltip" data-placement="top" title="Edit Collection">
                  <i class="mbs-author-tools icon-Pen">
                  </i>
                </a>
              </div>
              <div class="col col-md-6 tools-col-6">
                <a class="no-decoration-link" @click="deleteCollection" href="#" data-toggle="tooltip" data-placement="top" title="Delete Collection  ">
                  <i class="mbs-author-tools icon-Bin">
                  </i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="myCollection.books.length == 1">
        <div class="mbs mbs-card-book-cover img-responsive" style="background:url(@{{myCollection.books[0]}}) no-repeat; background-size: cover;">
          <div class="overlay">
            <div class="row collection-cover">&nbsp;</div>
            <div class="row">
              <div class="col col-md-6 tools-col-6">
                <a class="no-decoration-link" @click="editCollection" href="#" data-toggle="tooltip" data-placement="top" title="Edit Collection">
                  <i class="mbs-author-tools icon-Pen">
                  </i>
                </a>
              </div>
              <div class="col col-md-6 tools-col-6">
                <a class="no-decoration-link" @click="deleteCollection" href="#" data-toggle="tooltip" data-placement="top" title="Delete Collection  ">
                  <i class="mbs-author-tools icon-Bin">
                  </i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="myCollection.books == null || myCollection.books.length == 0">
        <div class="mbs mbs-card-book-cover img-responsive" style="background:url({{asset('/assets/covers/empty.png')}}) no-repeat; background-size: cover;">
          <div class="overlay">
            <div class="row collection-cover">&nbsp;</div>
            <div class="row">
              <div class="col col-md-6 tools-col-6">
                <a class="no-decoration-link" @click="editCollection" href="#" data-toggle="tooltip" data-placement="top" title="Edit Collection">
                  <i class="mbs-author-tools icon-Pen">
                  </i>
                </a>
              </div>
              <div class="col col-md-6 tools-col-6">
                <a class="no-decoration-link" @click="deleteCollection" href="#" data-toggle="tooltip" data-placement="top" title="Delete Collection  ">
                  <i class="mbs-author-tools icon-Bin">
                  </i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="mbs mbs-book-title"><a href="/collection/@{{myCollection.id}}">@{{myCollection.name}}</a></span>
    <span class="mbs mbs-book-minor-info" v-if="myCollection.books != null && myCollection.books.length != 0">Books in collection: <strong>@{{myCollection.books.length}}</strong></span>
    <span class="mbs mbs-book-minor-info" v-if="myCollection.books == null || myCollection.books.length == 0">Books in collection: <strong>0</strong></span>
  </div>

  <script>
  $('[data-toggle="tooltip"]').tooltip();
  </script>

</template>
