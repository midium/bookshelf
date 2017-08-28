@extends('layouts.app')

@section('content')
  <div class="container-fluid" id="test">
    <div class="mbs mbs-head-row" style="background: url('{{asset('assets/under-construction.jpg')}}') no-repeat; background-size: contain; background-position: center;">
      <div class="mbs mbs-head-search">
        <button class="btn btn-sm btn-default" onclick="window.history.back()">Back</button>
      </div>
    </div>
    <div class="mbs mbs-content-row">
      <div class="row no-margin">
        <div class="col-md-12">
          <h2>Sorry, we are still working on this!!</h2>
          <h4>Dear user, unfortunately, the feature you required is still not implemented.<br>
              We are working hard to complete it in the shortest time possible.<br>
              Please try to use this feature back in some days.<br><br>
              Thanks,<br>
              The MiDiUm Bookshelf team.</h4>
        </div>
      </div>
    </div>
  </div>
@endsection
