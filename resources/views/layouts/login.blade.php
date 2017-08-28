<!DOCTYPE html>
<html lang="en" ng-app="app">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

  	<title>{{env('APP_NAME')}}</title>

    <link rel="icon" type="image/png" href="{{asset('/assets/favicon.png')}}">

    <!-- Fonts -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel='stylesheet' type='text/css'>
    <link href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700" rel='stylesheet' type='text/css'>

    <!-- Styles -->
    <link href="{{asset('/css/bootstrap.min.css')}}" rel="stylesheet">
    <link href="{{asset('/css/fuelux.min.css')}}" rel="stylesheet">

    <link href="{{asset('/css/sweetalert.min.css')}}" rel="stylesheet">
    @yield('other-css')

    <script src="{{asset('/js/jquery-2.1.4.min.js')}}"></script>
    <script src="{{asset('/js/bootstrap.min.js')}}"></script>
    <script src="{{asset('/js/fuelux.min.js')}}"></script>
    <script src="{{asset('/js/sweetalert.min.js')}}"></script>
    @yield('other-js')

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  	<!--[if lt IE 9]>
  	<script src="{{ asset('/js/html5shiv-3.7.2.js') }}"></script>
  	<script src="{{ asset('/js/respond-1.4.2.js') }}"></script>
  	<![endif]-->

  </head>
  <body>
    <!--include('nav.global.top')-->
    @yield('content')

    @yield('scripts')

    @yield('beforebodyend')
  </body>
</html>
