<template id="author-card-template">
  <div class="col col-md-3 author-card centered" data-id="@{{myAuthor.id}}">
    <div class="mbs mbs-author-image img-responsive" style="background:url(@{{myAuthor.avatar}}) no-repeat; background-size: cover; background-position:center;">
      <i class="mbs @{{myAuthor.nat}} flag"></i>
      <input type="hidden" id="id" value="@{{myAuthor.id}}" v-model="author_id" />
      <div class="overlay">
        <div class="container-fluid">
          <div class="row cover">&nbsp;</div>
          <div class="row">
            <div class="col col-md-3 tools-col centered no-padding">
              <a class="no-decoration-link" href="@{{'/author/'+ myAuthor.id}}" data-toggle="tooltip" data-placement="top" title="Author Details">
                <i class="mbs-author-tools icon-User">
                </i>
              </a>
            </div>
            <div class="col col-md-3 tools-col centered no-padding">
              <a class="no-decoration-link" href="@{{ '/author/books/'+  myAuthor.id}}" data-toggle="tooltip" data-placement="top" title="Author Books">
                <i class="mbs-author-tools icon-Bookmark">
                  <span class="path1"></span><span class="path2"></span>
                </i>
              </a>
            </div>
            <div class="col col-md-3 tools-col centered no-padding">
              <a class="no-decoration-link" href="#" data-toggle="tooltip" data-placement="top" title="Edit Author" @click="editAuthor">
                <i class="mbs-author-tools icon-UserEdit">
                  <span class="path1"></span><span class="path2"></span>
                </i>
              </a>
            </div>
            <div class="col col-md-3 tools-col centered no-padding">
              <a class="no-decoration-link" href="#" data-toggle="tooltip" data-placement="top" title="Delete Author" @click="deleteAuthor">
                <i class="mbs-author-tools icon-UserRemove">
                  <span class="path1"></span><span class="path2"></span>
                </i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="mbs mbs-author-name">@{{myAuthor.name}}</span>
    <span class="mbs mbs-author-minor-info">Books on shelf: <strong>@{{myAuthor.bcount}}</strong></span>
    <span class="mbs mbs-author-minor-info">
      <inf title="Born" v-if="myAuthor.birth">b:</inf> <strong>@{{myAuthor.birth}}</strong>
      &nbsp;<inf title="Death" v-if="myAuthor.death">d:</inf> <strong>@{{myAuthor.death}}</strong>
    </span>
  </div>
</template>
