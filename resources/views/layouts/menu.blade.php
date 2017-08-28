<img src="{{asset('/assets/menu-logo.png')}}" />
<ul class="mbs mbs-menu">
  <li class="mbs-menu-header">Browse</li>
  <li {{(!isset($active_menu) || $active_menu == '' || $active_menu == 'shelf')?'class=active':''}}><a href="{{url('/')}}">Bookshelf</a></li>
  <li {{(isset($active_menu) && $active_menu == 'reading')?'class=active':''}}><a href="{{url('/reading')}}">Now Reading</a></li>
  <li {{(isset($active_menu) && $active_menu == 'collections')?'class=active':''}}><a href="{{url('/collections')}}">Collections</a></li>
  <li {{(isset($active_menu) && $active_menu == 'stats')?'class=active':''}}><a href="{{url('/stats')}}">Statistics</a></li>
  <li class="mbs-menu-header">Details</li>
  <li {{(isset($active_menu) && $active_menu == 'authors')?'class=active':''}}><a href="{{url('/authors')}}">Authors</a></li>
  <li {{(isset($active_menu) && $active_menu == 'publishers')?'class=active':''}}><a href="{{url('/publishers')}}">Publishers</a></li>
  <li {{(isset($active_menu) && $active_menu == 'genres')?'class=active':''}}><a href="{{url('/genres')}}">Genres</a></li>
  <li {{(isset($active_menu) && $active_menu == 'languages')?'class=active':''}}><a href="{{url('/languages')}}">Languages</a></li>
  <li class="mbs-menu-header">Tools</li>
  <li {{(isset($active_menu) && $active_menu == 'search')?'class=active':''}}><a href="{{url('/online')}}">Search Online</a></li>
  <li {{(isset($active_menu) && $active_menu == 'settings')?'class=active':''}}><a href="{{url('/settings')}}">Settings</a></li>
  <li class="mbs-menu-header">User</li>
  <!--<li><a href="#">Profile</a></li>-->
  <li><a href="{{url('/logout')}}">Logout</a></li>
</ul>
