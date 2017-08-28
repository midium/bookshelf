<div class="tab-pane" id="tab_votes">
  <div class="tab-header">
    Votes' Stats
  </div>
  <div class="row no-margin">
    <div class="col col-md-4 text-right">
      <label>Best ranked book(s)<span v-show="!votes.bestRanked.vote || votes.bestRanked.vote != ''"> (@{{votes.bestRanked.vote}} stars) </span>:</label>
    </div>
    <div class="col col-md-8 mbs mbs-list-item" v-show="!votes.bestRanked.books || votes.bestRanked.books != ''">
      <div v-for="voted in votes.bestRanked.books">@{{voted}}</div>
    </div>
  </div>
  <div class="row no-margin">
    <div class="col col-md-4 text-right">
      <label>Worst ranked book(s)<span v-show="!votes.worstRanked.vote || votes.worstRanked.vote != ''"> (@{{votes.worstRanked.vote}} stars) </span>:</label>
    </div>
    <div class="col col-md-8 mbs mbs-list-item" v-show="!votes.worstRanked.books || votes.worstRanked.books != ''">
      <div v-for="voted in votes.worstRanked.books">@{{voted}}</div>
    </div>
  </div>
  <div class="row">&nbsp;</div>
  <div class="tab-header" v-show="votes.chart.labels && votes.chart.labels != ''">Books per Votes (with more than 1 book):</div>
  <div class="row no-margin" v-show="votes.chart.labels && votes.chart.labels != ''">
    <canvas id="booksVotesChart" width="400" height="140"></canvas>
  </div>
</div>
