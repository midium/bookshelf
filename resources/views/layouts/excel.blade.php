<!DOCTYPE html>
<html lang="en" ng-app="app">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta id="token" name="token" value="{{ csrf_token() }}" >
  </head>
  <body>
    @yield('content')
  </body>
</html>
