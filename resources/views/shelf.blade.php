@extends('layouts.app')

@section('other-css')
  <link href="{{asset('/css/bootstrap-rating.css')}}" rel="stylesheet">
  <link href="{{asset('/css/iconmoon.css')}}" rel="stylesheet">
  <link href="{{asset('/css/bootstrap-select.min.css')}}" rel="stylesheet">
@endsection

@section('other-js')
  <script src="{{asset('/js/bootstrap-rating.min.js')}}"></script>
  <script src="{{asset('/js/jquery.dotdotdot.min.js')}}"></script>
@endsection

@section('content')
<div class="container-fluid" id="shelf">
  <div class="fullpage-mask"></div>
  <div class="fullpage-loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>
  <div class="mbs mbs-head-row">
    <my-header :search="true" search-placeholder="Search all books" header-title="Bookshelf"
               :export-excel="true" export-button-tooltip="Export Bookshelf to Excel"
               :add-button="true" add-button-tooltip="Add new Book" :clear-button="true"
               :search-for.sync="searchFor" :filter-search="true"></my-header>
  </div>
  <div class="mbs mbs-content-row with-address">
    <my-book v-for="book in books" :my-book="book"></my-book>
  </div>
  <my-addressbar :selected-letter.sync="currentLetter"></my-addressbar>

  <!-- Add/Edit Modal -->
  @include('modals.book')

</div>

<!-- VueJS components templates -->
@include('vue.addresstab')
@include('vue.book_card')
@include('vue.uploader')
@include('vue.selector')
@include('vue.header')
<!-------------------------------->

<script src="/js/vendor.js"></script>
<script src="/js/vue/shelf.js"></script>

@endsection
