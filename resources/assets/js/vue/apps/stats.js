
// Components declaration
Vue.component('my-header', MyHeader);

var vm = new Vue({
    el: '#stats',

    // data setup
    data: {
      books: {
        onShelf: '',
        mostPages: [],
        fewerPages: [],
        averagePages: '',
        chart: [],
      },
      authors: {
        onShelf: '',
        mostBooks: [],
        longestBook: [],
        shortestBook: [],
        countryAuthors: [],
        booksChart: [],
        countryChart: [],
      },
      publishers: {
        onShelf: '',
        mostBooks: [],
        longestBook: [],
        shortestBook: [],
        chart: [],
      },
      genres: {
        onShelf: '',
        mostBooks: [],
        longestBook: [],
        shortestBook: [],
        chart: [],
      },
      reads: {
        howMany: '',
        longestBook: [],
        shortestBook: [],
        mostRead: [],
        reads:[],
        chart: [],
      },
      votes: {
        bestRanked: [],
        worstRanked: [],
        chart: [],
      },
    },

    // what to do once the page load at first
    ready: function(){
      this.fetchBooksStats();
      this.fetchAuthorsStats();
      this.fetchPublishersStats();
      this.fetchGenresStats();
      this.fetchReadsStats();
      this.fetchVotesStats();
    },

    // data changing watchers
    watch: {
    },

    // computations used to show/hide enable/disable controls
    computed: {
    },

    // methods
    methods: {
      fetchBooksStats: function(){
        this.showLoader();

        this.$http.get('/api/book_stats', function(response){
          if(response.success){
            this.books.onShelf = response.value.onShelf;
            this.books.mostPages = response.value.mostPages;
            this.books.fewerPages = response.value.fewerPages;
            this.books.averagePages = response.value.averagePages;
            this.books.chart = response.value.chart;
            if (this.books.chart.labels != ''){
              this.renderChart('booksChart', 'Books per Pages', this.books.chart.labels, this.books.chart.values, this.books.chart.colors);
            }
          }
        });
      },
      renderChart: function(id, title, labels, values, colors){
        var that = this;
        var ctx = document.getElementById(id);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: values,
                    fillColor: colors,
                    strokeColor: colors,
                    highlightFill: colors,
                    highlightStroke: colors,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
      },
      randomColorGenerator: function () {
          return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
      },
      fetchAuthorsStats: function(){
        this.$http.get('/api/author_stats', function(response){
          if(response.success){
            this.authors.onShelf = response.value.onShelf;
            this.authors.mostBooks = response.value.mostBooks;
            this.authors.longestBook = response.value.longestBook;
            this.authors.shortestBook = response.value.shortestBook;
            this.authors.countryAuthors = response.value.countryAuthors;
            this.authors.booksChart = response.value.booksChart;
            if (this.authors.booksChart.labels != ''){
              this.renderChart('booksAuthorsChart', 'Books per Author', this.authors.booksChart.labels, this.authors.booksChart.values, this.authors.booksChart.colors);
            }
            this.authors.countryAuthors = response.value.countryAuthors;
            this.authors.countryChart = response.value.countryChart;
            if (this.authors.countryChart.labels != ''){
              this.renderChart('authorsCountryChart', 'Authors per Country', this.authors.countryChart.labels, this.authors.countryChart.values, this.authors.countryChart.colors);
            }
          }
        });
      },
      fetchPublishersStats: function(){
        this.$http.get('/api/publisher_stats', function(response){
          if(response.success){
            this.publishers.onShelf = response.value.onShelf;
            this.publishers.mostBooks = response.value.mostBooks;
            this.publishers.longestBook = response.value.longestBook;
            this.publishers.shortestBook = response.value.shortestBook;
            this.publishers.chart = response.value.chart;
            if (this.publishers.chart.labels != ''){
              this.renderChart('booksPublishersChart', 'Books per Publisher', this.publishers.chart.labels, this.publishers.chart.values, this.publishers.chart.colors);
            }
          }
        });
      },
      fetchGenresStats: function(){
        this.$http.get('/api/genre_stats', function(response){
          if(response.success){
            this.genres.onShelf = response.value.onShelf;
            this.genres.mostBooks = response.value.mostBooks;
            this.genres.longestBook = response.value.longestBook;
            this.genres.shortestBook = response.value.shortestBook;
            this.genres.chart = response.value.chart;
            if (this.genres.chart.labels != ''){
              this.renderChart('booksGenresChart', 'Books per Genre', this.genres.chart.labels, this.genres.chart.values, this.genres.chart.colors);
            }
          }
        });
      },
      fetchReadsStats: function(){
        this.$http.get('/api/read_stats', function(response){
          if(response.success){
            this.reads.howMany = response.value.howMany;
            this.reads.mostRead = response.value.mostRead;
            this.reads.longestBook = response.value.longestBook;
            this.reads.shortestBook = response.value.shortestBook;
            this.reads.reads = response.value.reads;
            this.reads.chart = response.value.chart;

            var that = this;
            var ctx = document.getElementById('booksReadsChart');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: that.reads.chart.labels,
                    datasets: that.reads.chart.data
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });

          }

          this.hideLoader();
        });
      },
      fetchVotesStats: function(){
        this.showLoader();

        this.$http.get('/api/vote_stats', function(response){
          if(response.success){
            this.votes.bestRanked = response.value.bestRanked;
            this.votes.worstRanked = response.value.worstRanked;
            this.votes.chart = response.value.chart;
            if (this.votes.chart.labels != ''){
              this.renderChart('booksVotesChart', 'Books per Votes', this.votes.chart.labels, this.votes.chart.values, this.votes.chart.colors);
            }
          }
        });
      },
      showLoader: function(){
        $('.fullpage-mask').show();
        $('.fullpage-loader').show();
      },
      hideLoader: function(){
        $('.fullpage-mask').hide();
        $('.fullpage-loader').hide();
      }
    },

    // component events
    events: {
    }
});
