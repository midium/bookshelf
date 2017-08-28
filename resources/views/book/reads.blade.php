@extends('layouts.app')

@section('other-css')
  <link href="{{asset('/css/bootstrap-datetimepicker.min.css')}}" rel="stylesheet">
  <link href="{{asset('/css/bootstrap-select.min.css')}}" rel="stylesheet">
@endsection

@section('content')
  <div class="fullpage-mask"></div>
  <div class="fullpage-loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>
  <div class="container-fluid" id="reads">
    <input type="hidden" value="{{$book_id}}" v-model="book_id" id="id" />
    <div class="mbs mbs-head-row">
      <my-header :search="false" header-title="<strong>{{$book_title}}</strong> Reads" :back-button="true"></my-header>
    </div>
    <div class="mbs mbs-content-row container-fluid">
      <my-book-read v-for="read in theBook.reads" :book-id="{{$book_id}}" :read-status="read.status.value" :read-start="read.start" :read-end="read.end" :read-id="read.id" :statuses="statuses"></my-book-read>
      <button class="btn btn-default btn-sm new-read" @click="newRead"><i class="glyphicon glyphicon-plus">&nbsp;</i>Add new Read</button>
      <p>&nbsp;</p>
    </div>
  </div>

  <!-- VUE Controls -->
  @include('vue.read_book')
  @include('vue.selector')
  @include('vue.header')
  <!------------------>

  <script src="/js/vendor.js"></script>
  <script src="/js/moment.js"></script>
  <script src="/js/bootstrap-datetimepicker.min.js"></script>
  <script src="/js/vue/book_reads.js"></script>

@endsection
