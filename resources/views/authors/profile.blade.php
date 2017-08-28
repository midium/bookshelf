@extends('layouts.app')

@section('other-css')
  <link href="{{asset('/css/bootstrap-rating.css')}}" rel="stylesheet">
  <link href="{{asset('/css/iconmoon.css')}}" rel="stylesheet">
  <link href="{{asset('/css/flag.min.css')}}" rel="stylesheet">
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
  <div class="container-fluid" id="profile">
    <input type="hidden" value="{{$author_id}}" v-model="author_id" id="id" />
    <div class="mbs mbs-head-row">
      <my-header :search="false" header-title="<strong>{{$author_name}}</strong> Profile</span>" :back-button="true"></my-header>
    </div>
    <div class="mbs mbs-content-row container-fluid">
      <div class="row">
        <div class="col col-sm-6 col-md-4 mbs mbs-collection-details">
          <div class="row no-margin">
            <div class="col col-md-12 custom-font">
              <div class="img-responsive img-thumbnail mbs-author-avatar" style="background: url(@{{theAuthor.avatar}}) no-repeat; background-size: cover; background-position: center;"></div>
              <div class="mbs mbs-author-info">
                <label>Nationality:&nbsp;</label><span v-if="!nationalityAvailable">Not available</span><i v-if="nationalityAvailable" class="flag @{{theAuthor.nationality}}"></i><br>
                <label>Website:&nbsp;</label><span v-if="!websiteAvailable">Not available</span><a v-if="websiteAvailable" class="word-wrapping-text" href="@{{theAuthor.website}}" target="_blank">@{{theAuthor.website}}</a><br>
                <label>Email:&nbsp;</label><span v-if="!emailAvailable">Not available</span><a v-if="emailAvailable" class="word-wrapping-text" href="mailto:@{{theAuthor.email}}" >@{{theAuthor.email}}</a><br>
                <label v-if="birthAvailable">Birth:&nbsp;</label><span v-if="birthAvailable">@{{theAuthor.birth}}</span><br>
                <label v-if="deathAvailable">Death:&nbsp;</label><span v-if="deathAvailable">@{{theAuthor.death}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col col-sm-6 col-md-8 col-md-offset-5 mbs mbs-collection-books-list">
          <div class="row no-margin">
            <div class="col col-md-11">
              <h4 class="mbs mbs-authors-books-header">Author's Books on shelf</h4>
              <div class="mbs mbs-authors-books custom-font container-fluid">
                <div class="row no-margin">
                  <my-author-book v-for="book in books" :my-book="book" :show-details="false"
                  :has-tools="false" :how-many-on-row="2"></my-author-book>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- VUE Controls -->
  @include('vue.book_card')
  @include('vue.header')
  <!------------------>

  <script src="/js/vendor.js"></script>
  <script src="/js/vue/author_profile.js"></script>

  @endsection
