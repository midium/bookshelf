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
<div class="container-fluid" id="books">
  <div class="fullpage-mask"></div>
  <div class="fullpage-loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>
    <input type="hidden" id="entity_id" value="{{$entity_id}}" v-model="entityId" />
    <input type="hidden" id="entity_url" value="{{$entity_url}}" v-model="entityUrl" />
    <div class="mbs mbs-head-row">
      @if(!isset($hide_extra_string) || $hide_extra_string == false)
      <my-header header-title="<strong>{{$entity_name}}'s</strong> Books" :back-button="false"
                :show-image="{{($entity_image!='')?true:false}}" image-url="{{$entity_image}}"
                :search="true" :clear-button="true" :search-for.sync="searchFor"
                search-placeholder="Search all books" :filter-search="true"></my-header>
      @else
        <my-header header-title="<strong>{{$entity_name}}</strong>" :back-button="false"
                  :show-image="{{($entity_image!='')?true:false}}" image-url="{{$entity_image}}"
                  :search="true" :clear-button="true" :search-for.sync="searchFor"
                  search-placeholder="Search all books" :filter-search="true"></my-header>
      @endif
    </div>
    <div class="mbs mbs-content-row">
      <h4 v-if="books.length <= 0">There are no books available.</h4>
      <my-book v-for="book in books" :my-book="book" :show-details="false"
                :has-tools="true" :allow-edit="false" :allow-delete="false" ></my-book>
    </div>
</div>

<!-- Vue components templates -->
@include('vue.header')
@include('vue.book_card')
<!------------------------------>

<script src="/js/vendor.js"></script>
<script src="/js/vue/books.js"></script>

@endsection
