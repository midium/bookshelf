@extends('layouts.app')

@section('other-css')
  <link href="{{asset('/css/bootstrap-rating.css')}}" rel="stylesheet">
  <link href="{{asset('/css/iconmoon.css')}}" rel="stylesheet">
@endsection

@section('other-js')
  <script src="{{asset('/js/bootstrap-rating.min.js')}}"></script>
  <script src="{{asset('/js/jquery.dotdotdot.min.js')}}"></script>
@endsection

@section('content')
<div class="container-fluid" id="collection">
  <div class="fullpage-mask"></div>
  <div class="fullpage-loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>
  <input type="hidden" v-model="collection_id" value="{{$collection_id}}" />
  <div class="mbs mbs-head-row">
    <my-header header-title="{{$collection}}" :back-button="true"></my-header>
  </div>
  <div class="mbs mbs-content-row">
    <div class="row">
      <div class="col col-sm-6 col-md-3 text-right mbs mbs-collection-details">
        <div class="row no-margin">
          <div class="col col-md-12">
            <label class="mbs mbs-collection-label">Author(s):</label>
            <ul class="mbs mbs-list">
              <li class="mbs mbs-items-list" v-for="(id, author) in theCollection.authors"><a href="/author/@{{id}}">@{{author.name}}<span class="badge pull-left">@{{author.count}}</span></a></li>
            </ul>
          </div>
        </div>
        <div class="row no-margin">
          <div class="col col-md-12">
            <label class="mbs mbs-collection-label">Genre(s):</label>
            <ul class="mbs mbs-list">
              <li class="mbs mbs-items-list" v-for="(id, genre) in theCollection.genres"><a href="/genre/books/@{{id}}">@{{genre.name}}</a><span class="badge pull-left">@{{genre.count}}</span></li>
            </ul>
          </div>
        </div>
        <div class="row no-margin">
          <div class="col col-md-12">
            <label class="mbs mbs-collection-label">Publisher(s):</label>
            <ul class="mbs mbs-list">
              <li class="mbs mbs-items-list" v-for="(id, publisher) in theCollection.publishers"><a href="/publisher/books/@{{id}}">@{{publisher.name}}</a><span class="badge pull-left">@{{publisher.count}}</span></li>
            </ul>
          </div>
        </div>
        <div class="row no-margin">
          <div class="col col-md-12">
            <label class="mbs mbs-collection-label">Language(s):</label>
            <ul class="mbs mbs-list">
              <li class="mbs mbs-items-list" v-for="(id, language) in theCollection.languages"><a href="/language/books/@{{id}}">@{{language.name}}</a><span class="badge pull-left">@{{language.count}}</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col col-sm-6 col-md-9 col-md-offset-4 mbs mbs-collection-books-list">
        <div class="row no-margin">
          <div class="col col-md-11">
            <h4 class="mbs mbs-authors-books-header">Books on collection</h4>
            <div class="mbs mbs-collection-list">
              <my-book v-for="book in theCollection.books" :my-book="book"
                      :allow-edit="false" :allow-delete="false" :how-many-on-row="3"></my-book>
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
<script src="/js/vue/collection_details.js"></script>

@endsection
