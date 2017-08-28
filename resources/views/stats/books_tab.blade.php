<div class="tab-pane active" id="tab_books">
  <div class="tab-header">Books' Stats</div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Books on shelf:</label>
    </div>
    <div class="col col-md-9">@{{books.onShelf}}</div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Books with most pages:</label>
    </div>
    <div class="col col-md-9" v-show="!books.mostPages || books.mostPages.title != ''">
      @{{books.mostPages.title}} (@{{books.mostPages.pages}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Books with fewer pages:</label>
    </div>
    <div class="col col-md-9" v-show="!books.fewerPages || books.fewerPages.title != ''">
      @{{books.fewerPages.title}} (@{{books.fewerPages.pages}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Average pages per books:</label>
    </div>
    <div class="col col-md-9">@{{books.averagePages}}</div>
  </div>
  <div class="row">&nbsp;</div>
  <div class="tab-header" >Books per Pages:</div>
  <div class="row no-margin" >
    <canvas id="booksChart" width="400" height="140"></canvas>
  </div>
</div>
