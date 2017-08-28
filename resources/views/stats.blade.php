@extends('layouts.app')

@section('other-css')
@endsection

@section('other-js')
  <script src="{{asset('/js/chart.min.js')}}"></script>
@endsection

@section('content')
<div class="container-fluid" id="stats">
  <div class="fullpage-mask"></div>
  <div class="fullpage-loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>
    <div class="mbs mbs-head-row">
      <my-header header-title="Statistics" :search="false"></my-header>
    </div>
    <div class="mbs mbs-content-row">
      <div class="row no-margin">
        <div class="col col-md-12">
          <div class="tabbable-panel">
    				<div class="tabbable-line">
    					<ul class="nav nav-tabs ">
    						<li class="active">
    							<a href="#tab_books" data-toggle="tab">Books' Stats</a>
    						</li>
    						<li>
    							<a href="#tab_authors" data-toggle="tab">Authors' Stats</a>
    						</li>
    						<li>
    							<a href="#tab_publisher" data-toggle="tab">Publishers' Stats</a>
    						</li>
                <li>
    							<a href="#tab_genres" data-toggle="tab">Genres' Stats</a>
    						</li>
                <li>
    							<a href="#tab_reading" data-toggle="tab">Reading Stats</a>
    						</li>
                <li>
    							<a href="#tab_votes" data-toggle="tab">Votes' Stats</a>
    						</li>
    					</ul>
    					<div class="tab-content">
                @include('stats.books_tab')
                @include('stats.authors_tab')
                @include('stats.publishers_tab')
                @include('stats.genres_tab')
                @include('stats.readings_tab')
                @include('stats.votes_tab')
    					</div>
    				</div>
          </div>
        </div>
			</div>
    </div>
</div>

<!-- Vue components templates -->
@include('vue.header')
@include('vue.book_card')
<!------------------------------>

<script src="/js/vendor.js"></script>
<script src="/js/vue/stats.js"></script>

@endsection
