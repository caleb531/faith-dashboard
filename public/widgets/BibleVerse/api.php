<?php

  $API_BASE_URL = 'https://api.esv.org/v3/passage/html/?';

  $api_info = json_decode(file_get_contents('api.json'));

  if ( empty( $api_info ) ) {
    $obj = new StdClass();
    $obj->error = 'API key is missing';
    echo json_encode($obj);
    http_response_code(500);
    return;
  }

  $params = array(
    'q' => $_GET['q'],
    'include-footnotes' => 'false',
    'include-footnote-body' => 'false',
    'include-chapter-numbers' => 'false',
    'include-verse-numbers' => 'false',
    'include-first-verse-numbers' => 'false',
    'include-headings' => 'false',
    'include-subheadings' => 'false',
    'include-audio-link' => 'false'
  );

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $API_BASE_URL . http_build_query($params));
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
      "Authorization: Token {$api_info->api_token}"
  ));
  curl_exec($ch);
  $info = curl_getinfo($ch);
  http_response_code($info['http_code']);
  curl_close($ch);

?>
