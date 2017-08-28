@extends('layouts.app')

@section('other-css')
  <link href="{{asset('/css/bootstrap-rating.css')}}" rel="stylesheet">
@endsection

@section('other-js')
  <script src="{{asset('/js/bootstrap-rating.min.js')}}"></script>
@endsection

@section('content')
  <div class="fullpage-mask"></div>
  <div class="fullpage-loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>
  <div class="container-fluid" id="details">
    <input type="hidden" value="{{$book_id}}" v-model="book_id" id="id" />
    <div class="mbs mbs-head-row">
      <my-header :search="false" header-title="{{$book_title}}" :back-button="true"></my-header>
    </div>
    <div class="mbs mbs-content-row container-fluid">
      <div class="row">
        <div class="col col-sm-6 col-md-3 text-right">
          <img src="@{{theBook.cover}}" class="img-responsive img-thumbnail" />
        </div>
        <div class="col col-sm-6 col-md-9">
          <div class="row">
            <div class="col col-md-3 text-right">
              <label>Original Title:</label>
            </div>
            <div class="col col-md-7 text-left">
              @{{theBook.original_title}}
            </div>
          </div>
          <div class="row">
            <div class="col col-md-3 text-right">
              <label>Publisher:</label>
            </div>
            <div class="col col-md-7 text-left">
              <a href="/publisher/books/@{{theBook.publisher.id}}">@{{theBook.publisher.name}}</a>
            </div>
          </div>
          <div class="row" v-if="theBook.authors">
            <div class="col col-md-3 text-right">
              <label>Authors:</label>
            </div>
            <div class="col col-md-7 text-left">
              @{{{theBook.authors}}}
            </div>
          </div>
          <div class="row" v-if="theBook.genres">
            <div class="col col-md-3 text-right">
              <label>Genres:</label>
            </div>
            <div class="col col-md-7 text-left">
              @{{{theBook.genres}}}
            </div>
          </div>
          <div class="row">
            <div class="col col-md-3 text-right">
              <label>Pages:</label>
            </div>
            <div class="col col-md-7 text-left">
              @{{theBook.pages}}
            </div>
          </div>
          <div class="row">
            <div class="col col-md-3 text-right">
              <label>Year:</label>
            </div>
            <div class="col col-md-7 text-left">
              @{{theBook.year}}
            </div>
          </div>
          <div class="row">
            <div class="col col-md-3 text-right">
              <label>Vote:</label>
            </div>
            <div class="col col-md-7 text-left">
              <input type="hidden" class="rating" data-readonly value="@{{theBook.vote}}" data-filled="glyphicon glyphicon-star-empty mbs-rating-symbol mbs-symbol-filled" data-empty="glyphicon glyphicon-star-empty mbs-rating-symbol"/>
            </div>
          </div>
          <div class="row">
            <div class="col col-md-3 text-right">
              <label>Isbn:</label>
            </div>
            <div class="col col-md-7 text-left">
              @{{theBook.isbn}}
            </div>
          </div>
          <div class="row" v-if="theBook.languages">
            <div class="col col-md-3 text-right">
              <label>Languages:</label>
            </div>
            <div class="col col-md-7 text-left">
              @{{{theBook.languages}}}
            </div>
          </div>
          <div class="row" v-if="theBook.genres">
            <div class="col col-md-3 text-right">
              <label>Collections:</label>
            </div>
            <div class="col col-md-7 text-left">
              @{{{theBook.collections}}}
            </div>
          </div>
          <div class="row">
            <div class="col col-md-3 text-right">
              <label>Description:</label>
            </div>
            <div class="col col-md-7 text-left">
              @{{theBook.description}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  @include('vue.header')

  <script src="/js/vendor.js"></script>
  <script src="/js/vue/book_details.js"></script>

  @endsection
