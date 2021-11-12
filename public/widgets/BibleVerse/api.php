<?php

  $API_BASE_URL = 'https://api.esv.org/v3/passage/text/?q=';

  $api_info = json_decode(file_get_contents('api.json'));

  if ( empty( $api_info ) ) {
    $obj = new StdClass();
    $obj->error = 'API key is missing';
    echo json_encode($obj);
    http_response_code(500);
    return;
  }

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $API_BASE_URL . 'john.3.16');
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      "Authorization: Token {$api_info->api_token}"
  ));
  $api_response = curl_exec($ch);
  curl_close($ch);

  echo $api_response;

?>
