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
<div class="container-fluid" id="readings">
  <div class="fullpage-mask"></div>
  <div class="fullpage-loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>

    <div class="mbs mbs-head-row">
      <my-header header-title="Now Reading" :search="true" search-placeholder="Seach all reading books" :clear-button="true" :search-for.sync="searchFor"></my-header>
    </div>
    <div class="mbs mbs-content-row">
      <h4 v-if="readings.length <= 0">You are not reading no books at the moment.</h4>
      <my-book v-for="read in readings | filterBy searchFor" :my-book="read"
               :has-tools="true" :allow-delete="false" :show-details="false"></my-book>
    </div>

    <!-- Add/Edit Modal -->
    @include('modals.book')
</div>

<!-- Vue components templates -->
@include('vue.header')
@include('vue.book_card')
@include('vue.uploader')
@include('vue.selector')
<!------------------------------>

<script src="/js/vendor.js"></script>
<script src="/js/vue/reading.js"></script>

@endsection
