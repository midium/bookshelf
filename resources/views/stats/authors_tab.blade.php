<div class="tab-pane" id="tab_authors">
  <div class="tab-header">
    Authors' Stats
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Authors on shelf:</label>
    </div>
    <div class="col col-md-9">@{{authors.onShelf}}</div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Author with most books:</label>
    </div>
    <div class="col col-md-9" v-show="!authors.mostBooks || authors.mostBooks.title != ''">
      @{{authors.mostBooks.name}} (@{{authors.mostBooks.books}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Author with longest book:</label>
    </div>
    <div class="col col-md-9" v-show="!authors.longestBook || authors.longestBook.title != ''">
      @{{authors.longestBook.name}} (@{{authors.longestBook.title}}, @{{authors.longestBook.pages}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Author with shortest book:</label>
    </div>
    <div class="col col-md-9" v-show="!authors.shortestBook || authors.shortestBook.title != ''">
      @{{authors.shortestBook.name}} (@{{authors.shortestBook.title}}, @{{authors.shortestBook.pages}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Country with more authors:</label>
    </div>
    <div class="col col-md-9">@{{authors.countryAuthors.name}} (@{{authors.countryAuthors.count}})</div>
  </div>
  <div class="row">&nbsp;</div>
  <div class="tab-header" v-show="authors.booksChart.labels && authors.booksChart.labels != ''">Books per Author (just authors with more than one book on shelf):</div>
  <div class="row no-margin" v-show="authors.booksChart.labels && authors.booksChart.labels != ''">
    <canvas id="booksAuthorsChart" width="400" height="140"></canvas>
  </div>
  <div class="tab-header" v-show="authors.countryChart.labels && authors.countryChart.labels != ''">Author per Country:</div>
  <div class="row no-margin" v-show="authors.countryChart.labels && authors.countryChart.labels != ''">
    <canvas id="authorsCountryChart" width="400" height="140"></canvas>
  </div>
</div>
