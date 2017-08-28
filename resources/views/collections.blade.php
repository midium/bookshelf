@extends('layouts.app')

@section('other-css')
  <link href="{{asset('/css/iconmoon.css')}}" rel="stylesheet">
@endsection

@section('content')
<div class="fullpage-mask"></div>
<div class="fullpage-loader">
  <svg class="circular" viewBox="25 25 50 50">
    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
  </svg>
</div>
<div class="container-fluid" id="collections">
  <div class="mbs mbs-head-row">
    <my-header :search="true" search-placeholder="Search all collections" header-title="Collections"
               :add-button="true" add-button-tooltip="Add new Collection" :clear-button="true"
               :search-for.sync="searchCollection" :filter-search="true"></my-header>
  </div>
  <div class="mbs mbs-content-row">
    <my-book-collection v-for="collection in collections" :my-collection="collection"></my-book-collection>
  </div>

  <!-- Modal Forms -->
  @include('modals.collection')
  <!----------------->

</div>

<!-- Vue Components Templates -->
@include('vue.collection')
@include('vue.checklist')
@include('vue.header')
<!------------------------------>

<script src="/js/vendor.js"></script>
<script src="/js/vue/collections.js"></script>

@endsection
