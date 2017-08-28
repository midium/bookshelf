<div class="tab-pane" id="tab_reading">
  <div class="tab-header">
    Reading Stats
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Read books:</label>
    </div>
    <div class="col col-md-9">@{{reads.howMany}}</div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Longest book read:</label>
    </div>
    <div class="col col-md-9" v-show="!reads.longestBook || reads.longestBook.title != ''">
      @{{reads.longestBook.title}} (@{{reads.longestBook.pages}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Shortest book read:</label>
    </div>
    <div class="col col-md-9" v-show="!reads.shortestBook || reads.shortestBook.title != ''">
      @{{reads.shortestBook.title}} (@{{reads.shortestBook.pages}})
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Most read book(s):</label>
    </div>
    <div class="col col-md-9 mbs mbs-list-item" v-show="!reads.mostRead || reads.mostRead.title != ''">
      <div v-for="read in reads.mostRead">@{{read.title}} (@{{read.reads}})</div>
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-3 text-right">
      <label>Reads chronology:</label>
    </div>
    <div class="col col-md-5" v-show="!reads.reads || reads.reads != ''">
      <table class="table table-striped table-bordered table-hover table-condensed table-fixedheader">
        <thead>
          <tr>
            <th>Year</th>
            <th>Books read</th>
            <th>Total pages</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="read in reads.reads">
            <td><a href="/stats/books/@{{read.year}}">@{{read.year}}</a></td>
            <td>@{{read.books}}</td>
            <td>@{{read.pages}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="row no-margin" >
    <canvas id="booksReadsChart" width="400" height="140"></canvas>
  </div>
</div>
