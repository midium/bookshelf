@extends('layouts.app')

@section('other-css')
  <link href="{{asset('/css/bootstrap-select.min.css')}}" rel="stylesheet">
@endsection

@section('other-js')
@endsection

@section('content')
<div class="container-fluid" id="search">
  <div class="fullpage-mask"></div>
  <div class="fullpage-loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>
  <div class="mbs mbs-head-row">
    <my-header :search="false" header-title="Online Book Search"></my-header>
  </div>
  <div class="mbs mbs-content-row">
    <div class="container-fluid">
      <div class="row no-margin">
        <div class="col col-md-12">
          <form v-on:submit="onSubmitSearch" class="form-inline">
            <div class="form-group">
              <label>Book ISBN:</label>
              <input class="form-control" type="text" v-model="searchIsbn" />
              <button class="btn btn-default" type="submit" :disabled="!searchIsbn"><i class="fa fa-search">&nbsp;</i>Search</button>
            </div>
          </form>
        </div>
      </div>
      <div class="row no-margin">
        <div class="col col-md-12">&nbsp;</div>
      </div>
      <div class="row no-margin">
        <div class="col col-md-12">
          <h4>Search Result</h4>
          <div class="col col-xs-3 text-right">
            <img v-if="foundBook.cover" src="@{{foundBook.cover}}" class="img-responsive img-thumbnail" />
            <img v-if="!foundBook.cover" src="{{asset('/assets/covers/empty.png')}}" class="img-responsive img-thumbnail" />
          </div>
          <div class="col col-xs-9">
            <div class="row">
              <div class="col col-md-12">
                <label>Title:&nbsp;</label><span>@{{foundBook.title}}</span>
              </div>
              <div class="col col-md-12">
                <label>Author:&nbsp;</label><span>@{{foundBook.author}}</span>
              </div>
              <div class="col col-md-12">
                <label>Publisher:&nbsp;</label><span>@{{foundBook.publisher}}</span>
              </div>
              <div class="col col-md-12">
                <label>Year:&nbsp;</label><span>@{{foundBook.year}}</span>
              </div>
              <div class="col col-md-12">
                <label>Language:&nbsp;</label><span>@{{foundBook.language}}</span>
              </div>
              <div class="col col-md-12">
                <label>Isbn:&nbsp;</label><span>@{{foundBook.isbn}}</span>
              </div>
              <div class="col col-md-12">
                <label>Description:&nbsp;</label><span>@{{foundBook.description}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row no-margin">
        <div class="col col-md-12">
          <h4>Available Actions</h4>
          <button class="btn btn-default" :disabled="somethingFound" @click="createBook">
            <i class="fa fa-plus-circle">&nbsp;</i>Create New Book
          </button>
          <!--<button class="btn btn-default" :disabled="somethingFound">
            <i class="fa fa-pencil">&nbsp;</i>Edit Existing Book
          </button>-->
        </div>
      </div>
      <div class="row no-margin">&nbsp;</div>
    </div>
  </div>

  <!-- Modals -->
  @include('modals.online_create')
</div>

<!-- VueJS components templates -->
@include('vue.header')
@include('vue.uploader')
@include('vue.selector')
<!-------------------------------->

<script src="/js/vendor.js"></script>
<script src="/js/vue/search.js"></script>

@endsection
