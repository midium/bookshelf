<div class="tab-pane" id="tab_genres">
  <div class="tab-header">
    Genres' Stats
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Genres on shelf:</label>
    </div>
    <div class="col col-md-9">@{{genres.onShelf}}</div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Genre with most books:</label>
    </div>
    <div class="col col-md-9" v-show="!genres.mostBooks || genres.mostBooks.name != ''">
      @{{genres.mostBooks.name}} (@{{genres.mostBooks.books}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Genre with longest book:</label>
    </div>
    <div class="col col-md-9" v-show="!genres.longestBook || genres.longestBook.title != ''">
      @{{genres.longestBook.name}} (@{{genres.longestBook.title}}, @{{genres.longestBook.pages}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Genre with shortest book:</label>
    </div>
    <div class="col col-md-9" v-show="!genres.shortestBook || genres.shortestBook.title != ''">
      @{{genres.shortestBook.name}} (@{{genres.shortestBook.title}}, @{{genres.shortestBook.pages}})
    </div>
  </div>
  <div class="row">&nbsp;</div>
  <div class="tab-header" v-show="genres.chart.labels && genres.chart.labels != ''">Books per Genre (with more than 1 book):</div>
  <div class="row no-margin" v-show="genres.chart.labels && genres.chart.labels != ''">
    <canvas id="booksGenresChart" width="400" height="140"></canvas>
  </div>
</div>
