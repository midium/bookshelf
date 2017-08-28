@extends('layouts.app')

@section('other-css')
  <link href="{{asset('/css/iconmoon.css')}}" rel="stylesheet">
  <link href="{{asset('/css/flag.min.css')}}" rel="stylesheet">
@endsection

@section('content')
<div class="fullpage-mask"></div>
<div class="fullpage-loader">
  <svg class="circular" viewBox="25 25 50 50">
    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
  </svg>
</div>
<div class="container-fluid" id="publishers">
  <div class="mbs mbs-head-row">
    <my-header :search="true" header-title="Publishers" search-placeholder="Search all publishers" ></my-header>
  </div>
  <div class="mbs mbs-content-row">
    <div class="row no-margin">
      <div class="col-md-12">
        <a class="btn btn-sm btn-default pubshr" @click="addPublisher">
          <i class="icon-Add">
            <span class="path1"></span><span class="path2"></span>
          </i>
          Add Publisher
        </a>
        <a class="btn btn-sm btn-default pubshr" v-if="searchPerformed" @click="cleanFilter">
          <i class="icon-Cancel">
            <span class="path1"></span><span class="path2"></span>
          </i>
          Clear Search
        </a>
        <vuetable
              api-url="{{ url('/api/publishers') }}"
              :fields="fields"
              :sort-order="sortOrder"
              table-class="table table-striped table-hover"
              ascending-icon="glyphicon glyphicon-chevron-up"
              descending-icon="glyphicon glyphicon-chevron-down"
              pagination-class=""
              pagination-info-class=""
              pagination-component-class=""
              pagination-path=""
              pagination-component="vuetable-pagination-bootstrap"
              :item-actions="itemActions"
              :append-params="moreParams"
          ></vuetable>
      </div>
    </div>
  </div>

  <!-- Modal Forms -->
  @include('modals.publisher')
  <!----------------->
</div>

<!-- Vue components templates -->
@include('vue.pagination')
@include('vue.header')
<!------------------------------>

<script src="/js/vendor.js"></script>
<script src="/js/vue/publishers.js"></script>

@endsection
