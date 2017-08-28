@extends('layouts.app')

@section('other-css')
  <link href="{{asset('/css/iconmoon.css')}}" rel="stylesheet">
  <link href="{{asset('/css/flag.min.css')}}" rel="stylesheet">
  <link href="{{asset('/css/bootstrap-datetimepicker.min.css')}}" rel="stylesheet">
@endsection

@section('content')
  <div class="fullpage-mask"></div>
  <div class="fullpage-loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>
  <div class="container-fluid" id="authors">
    <div class="mbs mbs-head-row">
      <my-header :search="true" search-placeholder="Search all authors" header-title="Authors"
                 :add-button="true" add-button-tooltip="Add new Author" :clear-button="true"
                 :search-for.sync="searchFor" :filter-search="true"></my-header>
    </div>
    <my-addressbar :selected-letter.sync="currentLetter"></my-addressbar>
    <div class="mbs mbs-content-row with-address">
      <div class="row no-margin">
        <div class="col-md-12">
          <my-author v-for="author in authors" :my-author="author"></my-author>
        </div>
      </div>
    </div>

    <!-- Modal Forms -->
    @include('modals.author')
    <!----------------->
  </div>

<!-- Vuejs component template -->
@include('vue.addresstab')
@include('vue.author_card')
@include('vue.uploader')
@include('vue.header')
<!------------------------------>

<script src="/js/vendor.js"></script>
<script src="/js/moment.js"></script>
<script src="/js/bootstrap-datetimepicker.min.js"></script>
<script src="/js/vue/authors.js"></script>

@endsection
