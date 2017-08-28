@extends('layouts.app')

@section('other-css')
@endsection

@section('other-js')
@endsection

@section('content')
  <div class="fullpage-mask"></div>
  <div class="fullpage-loader">
    <svg class="circular" viewBox="25 25 50 50">
      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>
<div class="container-fluid" id="settings">
    <div class="mbs mbs-head-row">
      <my-header header-title="Settings" :search="false"></my-header>
    </div>
    <div class="mbs mbs-content-row">
      <div class="row no-margin mbs mbs-settings-row">
        <div class="col col-md-6">
          <div class="mbs mbs-settings-header"><i class="fa fa-spinner">&nbsp;</i>Lazy Loading
            <a type="submit" class="pull-right mbs mbs-save-link" data-toggle="tooltip" data-placement="bottom" title="Save" @click="settingsSave"><i class="fa fa-floppy-o"></i></a>
          </div>
          <form class="form-horizontal" id="lazy_load">
            <div class="row mbs mbs-settings-row-item">
              <div class="col col-md-6 text-right">
                <label class="control-label">Shelf page:</label>
              </div>
              <div class="col col-md-4">
                <input class="form-control text-center" type="number" v-model="settings.lazyLoad.shelf" />
              </div>
            </div>
            <div class="row mbs mbs-settings-row-item">
              <div class="col col-md-6 text-right">
                <label class="control-label">Authors page:</label>
              </div>
              <div class="col col-md-4">
                <input class="form-control text-center" type="number" v-model="settings.lazyLoad.authors" />
              </div>
            </div>
            <div class="row mbs mbs-settings-row-item">
              <div class="col col-md-6 text-right">
                <label class="control-label">Author's profile page:</label>
              </div>
              <div class="col col-md-4">
                <input class="form-control text-center" type="number" v-model="settings.lazyLoad.authorProfile" />
              </div>
            </div>
            <div class="row mbs mbs-settings-row-item">
              <div class="col col-md-6 text-right">
                <label class="control-label">Collections page:</label>
              </div>
              <div class="col col-md-4">
                <input class="form-control text-center" type="number" v-model="settings.lazyLoad.collections" />
              </div>
            </div>
            <div class="row mbs mbs-settings-row-item">
              <div class="col col-md-6 text-right">
                <label class="control-label">Collection's details page:</label>
              </div>
              <div class="col col-md-4">
                <input class="form-control text-center" type="number" v-model="settings.lazyLoad.collectionDetails" />
              </div>
            </div>
            <div class="row mbs mbs-settings-row-item">
              <div class="col col-md-6 text-right">
                <label class="control-label">Object's books page:</label>
              </div>
              <div class="col col-md-4">
                <input class="form-control text-center" type="number" v-model="settings.lazyLoad.objectsBooks" />
              </div>
            </div>
          </form>
        </div>
        <div class="col col-md-6">
          <div class="mbs mbs-settings-header"><i class="fa fa-copy">&nbsp;</i>Pagination
            <a type="submit" class="pull-right mbs mbs-save-link" data-toggle="tooltip" data-placement="bottom" title="Save" @click="settingsSave"><i class="fa fa-floppy-o"></i></a>
          </div>
          <form class="form-horizontal" id="pagination">
            <div class="row mbs mbs-settings-row-item">
              <div class="col col-md-6 text-right">
                <label class="control-label">Publishers page:</label>
              </div>
              <div class="col col-md-4">
                <input class="form-control text-center" type="number" v-model="settings.pagination.publishers" />
              </div>
            </div>
            <div class="row mbs mbs-settings-row-item">
              <div class="col col-md-6 text-right">
                <label class="control-label">Genres page:</label>
              </div>
              <div class="col col-md-4">
                <input class="form-control text-center" type="number" v-model="settings.pagination.genres" />
              </div>
            </div>
            <div class="row mbs mbs-settings-row-item">
              <div class="col col-md-6 text-right">
                <label class="control-label">Languages page:</label>
              </div>
              <div class="col col-md-4">
                <input class="form-control text-center" type="number" v-model="settings.pagination.languages" />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="row no-margin mbs mbs-settings-row">
        <div class="col col-md-12">
          <div class="mbs mbs-settings-header"><i class="fa fa-key">&nbsp;</i>Change Password</div>
          <div class="row no-margin">
            <button class="btn btn-default" @click="toggleChangePassword" v-show="!changeAllowed" transition="fade">Change Password</button>
            <form v-show="changeAllowed" v-on:submit="submitNewPassword" transition="fade">
              <div class="form-group" v-bind:class="{ 'has-error': !isCurrentPasswordCorrect }">
                <label>Current Password:</label>
                <input type="password" v-model="password.current" class="form-control" debounce="700" />
                <span class="error" v-show="!isCurrentPasswordCorrect">You have entered a wrong password!</span>
              </div>
              <div class="form-group">
                <label>New Password:</label>
                <input type="password" v-model="password.new" class="form-control" />
              </div>
              <div class="form-group" v-bind:class="{ 'has-error': !isNewPasswordCorrect }">
                <label>Confirm Password:</label>
                <input type="password" v-model="password.confirm" class="form-control" />
                <span class="error" v-show="!isNewPasswordCorrect">The confirmation password didn't match the new password entered!</span>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-default" v-bind:disabled="!areAllPasswordsEnteredAndValid">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</div>

<!-- Vue components templates -->
@include('vue.header')
<!------------------------------>

<script src="/js/vendor.js"></script>
<script src="/js/vue/settings.js"></script>
@endsection
