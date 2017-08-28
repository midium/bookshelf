<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Setting;
use App\User;
use Hash;
use Auth;

class SettingsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
      return view('settings')->with('active_menu', 'settings');
    }

    public function doesPasswordCorrespond(Request $request){
      if (Hash::check($request->current, Auth::user()->password)) {
        return response()->json(Array('success' => true));
      }

      return response()->json(Array('success' => false));
    }

    public function changePassword(Request $request){

    		$user = Auth::user();
    		if(isset($user)){
    			$credentials = [
    			    'email' => $user->email,
    			    'password' => $request->current,
    			];

    			if(\Auth::validate($credentials)) {
  						$user->fill([
  								'password' => Hash::make($request->new)
  						])->save();

  						return response()->json(['success' => true]);
    		  }
        } else {
          return response()->json(['success' => false, 'error' => 'It seems you are trying to change password for a unknown user.']);
        }
    	}

    public function getCurrentPassword(){
      $user = User::first();

      return response()->json(Array('data' => $user->password));
    }

    public function getSettings(){
      $settings = Setting::first();

      if(isset($settings) && $settings != null && $settings->count() > 0){
        return response()->json(Array('success' => true, 'data' => $settings));
      }

      return response()->json(Array('success' => false, 'error' => 'Settings not found!'));

    }

    public function setSettings(Request $request){

      try{
        $settings = Setting::first();

        $settings->shelf_lazyload = $request->lazyLoad['shelf'];
        $settings->authors_lazyload = $request->lazyLoad['authors'];
        $settings->author_profile_lazyload = $request->lazyLoad['authorProfile'];
        $settings->collections_lazyload = $request->lazyLoad['collections'];
        $settings->collection_details_lazyload = $request->lazyLoad['collectionDetails'];
        $settings->books_of_object_lazyload = $request->lazyLoad['objectsBooks'];

        $settings->publishers_pagination = $request->pagination['publishers'];
        $settings->genres_pagination = $request->pagination['genres'];
        $settings->languages_pagination = $request->pagination['languages'];

        $settings->save();

        return response()->json(Array('success' => true));

      } catch(Exception $e) {
        return response()->json(Array('success' => false, 'error' => $e->getMessage()));

      }
    }

}
