@extends('layouts.excel')

@section('content')
  <table>
    <thead>
      <tr>
        @foreach(get_object_vars($data[0]) as $key => $value)
          @if($key != 'id' && strpos($key, '_id') === false)
          <th>{{strtoupper(str_replace('_',' ',$key))}}</th>
          @endif
        @endforeach
      </tr>
    </thead>
    <tbody>
  @foreach($data as $book)
      <tr>
        @foreach(get_object_vars($book) as $key => $value)
          @if($key != 'id' && strpos($key, '_id') === false)
          <td>{{$value}}</td>
          @endif
        @endforeach
      </tr>
  @endforeach
    </tbody>
  </table>
@endsection
