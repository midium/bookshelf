<div class="tab-pane" id="tab_publisher">
  <div class="tab-header">
    Publishers' Stats
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Publishers on shelf:</label>
    </div>
    <div class="col col-md-9">@{{publishers.onShelf}}</div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Publisher with most books:</label>
    </div>
    <div class="col col-md-9" v-show="!publishers.mostBooks || publishers.mostBooks.name != ''">
      @{{publishers.mostBooks.name}} (@{{publishers.mostBooks.books}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Publisher with longest book:</label>
    </div>
    <div class="col col-md-9" v-show="!publishers.longestBook || publishers.longestBook.title != ''">
      @{{publishers.longestBook.name}} (@{{publishers.longestBook.title}}, @{{publishers.longestBook.pages}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Publisher with shortest book:</label>
    </div>
    <div class="col col-md-9" v-show="!publishers.shortestBook || publishers.shortestBook.title != ''">
      @{{publishers.shortestBook.name}} (@{{publishers.shortestBook.title}}, @{{publishers.shortestBook.pages}})
    </div>
  </div>
  <div class="row">&nbsp;</div>
  <div class="tab-header" v-show="publishers.chart.labels && publishers.chart.labels != ''">Books per Publisher (with more than 1 book):</div>
  <div class="row no-margin" v-show="publishers.chart.labels && publishers.chart.labels != ''">
    <canvas id="booksPublishersChart" width="400" height="140"></canvas>
  </div>
</div>
