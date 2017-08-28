<?php
function decodeBase64ToJpeg($base64_string) {
  $data = explode(',', $base64_string);

  return base64_decode($data[1]);
}

function urlToBase64Image($url){
  $type = pathinfo($url, PATHINFO_EXTENSION);

  if (function_exists('curl_init')) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $content = curl_exec($curl);
    curl_close($curl);

    if(strpos($content, "xml") === false){
      return 'data:image/' . $type . ';base64,' . base64_encode($content);
    }

    return '';

  } else {
    try {
      $data = file_get_contents($url);
      return 'data:image/' . $type . ';base64,' . base64_encode($data);
    } catch(Exception $e) {
      return '';
    }

  }

}

function randomColorGenerator() {
    return sprintf('#%06X', mt_rand(0, 0xFFFFFF));
}
