<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Setting;
use App\Book;
use App\Author;
use App\Publisher;
use App\Genre;
use App\Nationality;
use App\Read;
use DB;

class StatsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      return view('stats')->with('active_menu', 'stats');
    }

    public function book(){
      $data = [];

      $data['onShelf'] = Book::all()->count();
      $maxPages = Book::orderBy('pages', 'DESC')->first();
      if(isset($maxPages) && $maxPages != null && $maxPages != ''){
        $data['mostPages']['title'] = $maxPages->title;
        $data['mostPages']['pages'] = $maxPages->pages;
      } else {
        $data['mostPages']['title'] = '';
        $data['mostPages']['pages'] = '';
      }
      $minPages = Book::where('pages', '>', 0)->orderBy('pages', 'ASC')->first();
      if(isset($minPages) && $minPages != null && $minPages != ''){
        $data['fewerPages']['title'] = $minPages->title;
        $data['fewerPages']['pages'] = $minPages->pages;
      } else {
        $data['fewerPages']['title'] = '';
        $data['fewerPages']['pages'] = '';
      }
      $data['averagePages'] = round(Book::avg('pages'));

      // Chart data, pages per book (grouped by 100 pages)
      $bookStat = DB::select("SELECT
                                CONCAT(
                                  LPAD(((FLOOR(pages / 100)) * 100), 4, '0'),
                                  '-',
                                  LPAD((((FLOOR(pages / 100)) * 100) + 99), 4, '0')
                                ) AS ran,
                                COUNT(*) qty
                              FROM
                                books
                              WHERE books.pages > 0
                              GROUP BY ran
                              ORDER BY ran ;");

      $data['chart']['labels'] = '';
      $data['chart']['values'] = '';
      $data['chart']['colors'] = '';
      foreach ($bookStat as $stat) {
        $data['chart']['labels'][] = $stat->ran;
        $data['chart']['values'][] = $stat->qty;
        $data['chart']['colors'][] = randomColorGenerator();
      }

      return response()->json(Array('success' => 'true', 'value' => $data));
    }

    public function author(){
      $data = [];

      $data['onShelf'] = Author::all()->count();
      $mostBooks = Author::join('book_authors', 'book_authors.author_id', '=', 'authors.id')
                           ->groupBy('authors.id')->orderBy('count', 'DESC')
                           ->first(['authors.name', DB::raw('count(book_authors.id) as count')]);
      if(isset($mostBooks) && $mostBooks != null && $mostBooks != ''){
        $data['mostBooks']['name'] = $mostBooks->name;
        $data['mostBooks']['books'] = $mostBooks->count;
      } else {
        $data['mostBooks']['name'] = '';
        $data['mostBooks']['books'] = '';
      }
      $longestBook = Author::join('book_authors', 'book_authors.author_id', '=', 'authors.id')
                           ->join('books', 'books.id', '=', 'book_authors.book_id')
                           ->orderBy('pages', 'DESC')
                           ->first();

      if(isset($longestBook) && $longestBook != null && $longestBook != ''){
        $data['longestBook']['name'] = $longestBook->name;
        $data['longestBook']['title'] = $longestBook->title;
        $data['longestBook']['pages'] = $longestBook->pages;
      } else {
        $data['longestBook']['name'] = '';
        $data['longestBook']['title'] = '';
        $data['longestBook']['pages'] = '';
      }
      $shortestBook = Author::join('book_authors', 'book_authors.author_id', '=', 'authors.id')
                           ->join('books', 'books.id', '=', 'book_authors.book_id')
                           ->where('pages', '>', 0)
                           ->orderBy('pages', 'ASC')
                           ->first();
      if(isset($shortestBook) && $shortestBook != null && $shortestBook != ''){
        $data['shortestBook']['name'] = $shortestBook->name;
        $data['shortestBook']['title'] = $shortestBook->title;
        $data['shortestBook']['pages'] = $shortestBook->pages;
      } else {
        $data['shortestBook']['name'] = '';
        $data['shortestBook']['title'] = '';
        $data['shortestBook']['pages'] = '';
      }
      $countryAuthors = Nationality::join('authors', 'authors.nationality_id', '=', 'nationalities.id')
                                    ->groupBy('authors.nationality_id')->orderBy('count', 'DESC')
                                    ->first(['nationalities.*', DB::raw('count(authors.nationality_id) as count')]);
      if(isset($shortestBook) && $shortestBook != null && $shortestBook != ''){
        $data['countryAuthors']['name'] = $countryAuthors->name;
        $data['countryAuthors']['count'] = $countryAuthors->count;
      } else {
        $data['countryAuthors']['name'] = '';
        $data['countryAuthors']['count'] = '';
      }

      $data['booksChart']['labels'] = '';
      $data['booksChart']['values'] = '';
      $data['booksChart']['colors'] = '';
      $chartData = DB::select("SELECT
                                  a.`name`,
                                  COUNT(b.id) AS tot
                                FROM
                                  books b
                                  INNER JOIN book_authors ba
                                    ON b.`id` = ba.`book_id`
                                  INNER JOIN authors a
                                    ON a.`id` = ba.`author_id`
                                GROUP BY ba.`author_id`
                                HAVING tot > 1
                                ORDER BY a.`name`;");
      foreach ($chartData as $stat) {
        $data['booksChart']['labels'][] = $stat->name;
        $data['booksChart']['values'][] = $stat->tot;
        $data['booksChart']['colors'][] = randomColorGenerator();
      }

      $data['countryChart']['labels'] = '';
      $data['countryChart']['values'] = '';
      $data['countryChart']['colors'] = '';
      $chartData = DB::select("SELECT
                                  COUNT(*) AS tot,
                                  n.`name`
                                FROM
                                  authors a
                                  INNER JOIN nationalities n
                                    ON a.`nationality_id` = n.`id`
                                GROUP BY a.`nationality_id`
                                ORDER BY name ;");
      foreach ($chartData as $stat) {
        $data['countryChart']['labels'][] = $stat->name;
        $data['countryChart']['values'][] = $stat->tot;
        $data['countryChart']['colors'][] = randomColorGenerator();
      }

      return response()->json(Array('success' => 'true', 'value' => $data));
    }

    public function publisher(){
      $data = [];

      $data['onShelf'] = Publisher::all()->count();
      /*$mostBooks = Publisher::with(['booksCount' => function($query){
        $query->orderBy('count', 'DESC');
      }])->get();*/
      $mostBooks = DB::table('publishers')->select(DB::raw('publishers.name, count(*) as books_count'))
                                          ->join('books', 'books.publisher_id', '=', 'publishers.id')
                                          ->groupBy('books.publisher_id')
                                          ->orderBy('books_count', 'DESC')->first();
      if(isset($mostBooks) && $mostBooks != null && $mostBooks != ''){
        $data['mostBooks']['name'] = $mostBooks->name;
        $data['mostBooks']['books'] = $mostBooks->books_count;
      } else {
        $data['mostBooks']['name'] = '';
        $data['mostBooks']['books'] = '';
      }
      $longestBook = Publisher::join('books', 'books.publisher_id', '=', 'publishers.id')
                           ->orderBy('pages', 'DESC')
                           ->first();
      if(isset($longestBook) && $longestBook != null && $longestBook != ''){
        $data['longestBook']['name'] = $longestBook->name;
        $data['longestBook']['title'] = $longestBook->title;
        $data['longestBook']['pages'] = $longestBook->pages;
      } else {
        $data['longestBook']['name'] = '';
        $data['longestBook']['title'] = '';
        $data['longestBook']['pages'] = '';
      }
      $shortestBook = Publisher::join('books', 'books.publisher_id', '=', 'publishers.id')
                           ->where('pages', '>', 0)
                           ->orderBy('pages', 'ASC')
                           ->first();
      if(isset($shortestBook) && $shortestBook != null && $shortestBook != ''){
        $data['shortestBook']['name'] = $shortestBook->name;
        $data['shortestBook']['title'] = $shortestBook->title;
        $data['shortestBook']['pages'] = $shortestBook->pages;
      } else {
        $data['shortestBook']['name'] = '';
        $data['shortestBook']['title'] = '';
        $data['shortestBook']['pages'] = '';
      }

      $data['chart']['labels'] = '';
      $data['chart']['values'] = '';
      $data['chart']['colors'] = '';
      $chartData = DB::select("SELECT
                                  p.`name`,
                                  COUNT(b.id) AS tot
                                FROM
                                  books b
                                  INNER JOIN publishers p
                                  ON p.`id` = b.`publisher_id`
                                GROUP BY b.`publisher_id`
                                HAVING tot > 1
                                ORDER BY p.`name`;");
      foreach ($chartData as $stat) {
        $data['chart']['labels'][] = $stat->name;
        $data['chart']['values'][] = $stat->tot;
        $data['chart']['colors'][] = randomColorGenerator();
      }

      return response()->json(Array('success' => 'true', 'value' => $data));
    }

    public function genre(){
      $data = [];

      $data['onShelf'] = Genre::all()->count();
      $mostBooks = DB::table('genres')->select(DB::raw('genres.name, count(*) as books_count'))
                                          ->join('book_genres', 'book_genres.genre_id', '=', 'genres.id')
                                          ->groupBy('book_genres.genre_id')
                                          ->orderBy('books_count', 'DESC')->first();
      if(isset($mostBooks) && $mostBooks != null && $mostBooks != ''){
        $data['mostBooks']['name'] = $mostBooks->name;
        $data['mostBooks']['books'] = $mostBooks->books_count;
      } else {
        $data['mostBooks']['name'] = '';
        $data['mostBooks']['books'] = '';
      }
      $longestBook = Genre::join('book_genres', 'book_genres.genre_id', '=', 'genres.id')
                           ->join('books', 'book_genres.book_id', '=', 'books.id')
                           ->orderBy('pages', 'DESC')
                           ->first();
      if(isset($longestBook) && $longestBook != null && $longestBook != ''){
        $data['longestBook']['name'] = $longestBook->name;
        $data['longestBook']['title'] = $longestBook->title;
        $data['longestBook']['pages'] = $longestBook->pages;
      } else {
        $data['longestBook']['name'] = '';
        $data['longestBook']['title'] = '';
        $data['longestBook']['pages'] = '';
      }
      $shortestBook = Genre::join('book_genres', 'book_genres.genre_id', '=', 'genres.id')
                           ->join('books', 'book_genres.book_id', '=', 'books.id')
                           ->where('pages', '>', 0)
                           ->orderBy('pages', 'ASC')
                           ->first();
      if(isset($shortestBook) && $shortestBook != null && $shortestBook != ''){
        $data['shortestBook']['name'] = $shortestBook->name;
        $data['shortestBook']['title'] = $shortestBook->title;
        $data['shortestBook']['pages'] = $shortestBook->pages;
      } else {
        $data['shortestBook']['name'] = '';
        $data['shortestBook']['title'] = '';
        $data['shortestBook']['pages'] = '';
      }

      $data['chart']['labels'] = '';
      $data['chart']['values'] = '';
      $data['chart']['colors'] = '';
      $chartData = DB::select("SELECT
                                  g.`name`,
                                  COUNT(b.id) AS tot
                                FROM
                                  books b
                                  INNER JOIN book_genres bg
                                  ON b.`id` = bg.`book_id`
                                  INNER JOIN genres g
                                  ON g.`id` = bg.`genre_id`
                                GROUP BY bg.`genre_id`
                                HAVING tot > 1
                                ORDER BY g.`name`;");
      foreach ($chartData as $stat) {
        $data['chart']['labels'][] = $stat->name;
        $data['chart']['values'][] = $stat->tot;
        $data['chart']['colors'][] = randomColorGenerator();
      }

      return response()->json(Array('success' => 'true', 'value' => $data));
    }

    public function read(){
      $data = [];

      $data['howMany'] = Read::all()->count().' of '.Book::all()->count();
      $longestBook = Read::join('book_reads', 'book_reads.read_id', '=', 'reads.id')
                           ->join('books', 'book_reads.book_id', '=', 'books.id')
                           ->orderBy('pages', 'DESC')
                           ->first();
      if(isset($longestBook) && $longestBook != null && $longestBook != ''){
        $data['longestBook']['title'] = $longestBook->title;
        $data['longestBook']['pages'] = $longestBook->pages;
      } else {
        $data['longestBook']['title'] = '';
        $data['longestBook']['pages'] = '';
      }
      $shortestBook = Read::join('book_reads', 'book_reads.read_id', '=', 'reads.id')
                           ->join('books', 'book_reads.book_id', '=', 'books.id')
                           ->where('pages', '>', 0)
                           ->orderBy('pages', 'ASC')
                           ->first();
      if(isset($shortestBook) && $shortestBook != null && $shortestBook != ''){
        $data['shortestBook']['title'] = $shortestBook->title;
        $data['shortestBook']['pages'] = $shortestBook->pages;
      } else {
        $data['shortestBook']['title'] = '';
        $data['shortestBook']['pages'] = '';
      }
      $mostRead = DB::table('books')->select(DB::raw('books.title, count(*) as reads_count'))
                                          ->join('book_reads', 'book_reads.book_id', '=', 'books.id')
                                          ->groupBy('book_reads.book_id')
                                          ->orderBy('reads_count', 'DESC')->get();
      if(isset($mostRead) && $mostRead != null && $mostRead != ''){
        $reads = -1;
        foreach ($mostRead as $book) {
          if($reads == -1) {
            $reads = $book->reads_count;
          }
          if ($reads == $book->reads_count) {
            $item = [];
            $item['title'] = $book->title;
            $item['reads'] = $book->reads_count.' time(s)';

            $data['mostRead'][] = $item;

          } else {
            break;
          }
        }
      } else {
        $data['mostRead']['title'] = '';
        $data['mostRead']['reads'] = '';
      }

      $reads = DB::select("SELECT
                            COUNT(b.id) AS books,
                            SUM(b.pages) AS pages,
                            YEAR(r.end_date) AS year
                          FROM
                            books b
                            INNER JOIN book_reads br
                              ON b.id = br.`book_id`
                            INNER JOIN `reads` r
                              ON r.`id` = br.`read_id`
                          WHERE r.`end_date` IS NOT NULL
                            AND r.`end_date` <> ''
                            AND YEAR(r.`end_date`) <> 0
                          GROUP BY YEAR(r.`end_date`)
                          ORDER BY year DESC;");

      if(isset($reads) && $reads != null && $reads != ''){
        $data['reads'] = $reads;
        $data['chart']['data'] = [];
        $data['chart']['labels'] = [];

        $books_data = [];
        $pages_data = [];
        $colors = [];
        foreach ($reads as $read) {
          $data['chart']['labels'][] = $read->year;

          $books_data[] = intval($read->books,10);
          $pages_data[] = intval($read->pages,10);
          $colors[] = randomColorGenerator();
        }

        $books['label'] = 'Books';
        $books['data'] = $books_data;
        $books['fillColor'] = $colors;
        $books['strokeColor'] = $colors;
        $books['highlightFill'] = $colors;
        $books['highlightStroke'] = $colors;
        $books['backgroundColor'] = $colors;
        $books['borderColor'] = $colors;
        $books['borderWidth'] = 1;

        $data['chart']['data'][] = $books;

        $pages['label'] = 'Pages';
        $pages['data'] = $pages_data;
        $pages['fillColor'] = $colors;
        $pages['strokeColor'] = $colors;
        $pages['highlightFill'] = $colors;
        $pages['highlightStroke'] = $colors;
        $pages['backgroundColor'] = $colors;
        $pages['borderColor'] = $colors;
        $pages['borderWidth'] = 1;

        $data['chart']['data'][] = $pages;

      } else {
        $data['reads'] = '';
        $data['chart'] = '';
      }

      return response()->json(Array('success' => 'true', 'value' => $data));
    }

    public function vote(){
      $data = [];

      // Best ranked books
      $bestRanked = DB::table('books')->select(DB::raw('books.*'))
                                          ->whereRaw('books.vote = (SELECT DISTINCT MAX(b.vote) FROM books b LIMIT 1)')
                                          ->groupBy('books.id')
                                          ->orderBy('books.vote', 'DESC')
                                          ->orderBy('books.title', 'ASC')->get();
      if(isset($bestRanked) && $bestRanked != null && $bestRanked != ''){
        foreach ($bestRanked as $book) {
          $data['bestRanked']['books'][] = $book->title;
          $data['bestRanked']['vote'] = $book->vote;
        }
      } else {
        $data['bestRanked']['books'] = '';
        $data['bestRanked']['vote'] = '';
      }

      // Worst ranked books
      $worstRanked = DB::table('books')->select(DB::raw('books.*'))
                                          ->whereRaw('books.vote = (SELECT DISTINCT MIN(b.vote) FROM books b WHERE b.vote > 0 AND b.vote IS NOT NULL LIMIT 1)')
                                          ->groupBy('books.id')
                                          ->orderBy('books.vote', 'DESC')
                                          ->orderBy('books.title', 'ASC')->get();
      if(isset($worstRanked) && $worstRanked != null && $worstRanked != ''){
        foreach ($worstRanked as $book) {
          $data['worstRanked']['books'][] = $book->title;
          $data['worstRanked']['vote'] = $book->vote;
        }
      } else {
        $data['worstRanked']['books'] = '';
        $data['worstRanked']['vote'] = '';
      }


      // Chart data, votes per book
      $bookStat = DB::select("SELECT
                                b.vote,
                                COUNT(b.id) AS tot
                              FROM
                                books b
                              WHERE b.`vote` > 0
                                AND b.`vote` IS NOT NULL
                              GROUP BY b.`vote`
                              ORDER BY b.`vote` ;");

      $data['chart']['labels'] = '';
      $data['chart']['values'] = '';
      $data['chart']['colors'] = '';
      foreach ($bookStat as $stat) {
        $data['chart']['labels'][] = $stat->vote.' stars';
        $data['chart']['values'][] = $stat->tot;
        $data['chart']['colors'][] = randomColorGenerator();
      }

      return response()->json(Array('success' => 'true', 'value' => $data));
    }

    public function statsBooks($year){
      return view('books')->with('active_menu', 'stats')
                          ->with('entity_url', 'getStatsBooks')
                          ->with('entity_id', $year)
                          ->with('entity_name', 'Books read on '. $year )
                          ->with('entity_image', '')
                          ->with('hide_extra_string', true);
    }

    public function getStatsBooks($year) {

      $books = Book::select(DB::Raw('books.*'))->join('book_reads', 'book_reads.book_id', '=', 'books.id')
                                 ->join('reads', 'book_reads.read_id', '=', 'reads.id')
                                 ->whereRaw("YEAR(reads.end_date) = $year")
                                 ->orderBy('title', 'ASC')->get();

      if(!isset($books) || $books == null) {
        return response()->json(Array('success' => false, 'error' => 'No books read that year!'));
      }

      $data = [];
      foreach ($books as $book) {

        $data[] = ['title' => $book->title,
                    'cover' => $book->getCover(),
                    'id' => $book->id,
                    'authors' => $book->getAuthorsLinks(),
                    'vote' => intval($book->vote,10)];
      }

      return response()->json(Array('success' => true, 'value' => $data));
    }
}
