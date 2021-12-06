<?php
  // This API endpoint is given an Apple Podcasts URL, from which it parses the
  // numeric podcast ID and then fetches a JSON object containing the top-level
  // information about the podcast. This JSON object contains a URL to an RSS
  // feed, which in turn contains the desired feed/audio information.

  function parse_podcast_id_from_url($podcast_url) {
    $podcast_id_matches = array();
    preg_match('/\/id(\d+)$/', $podcast_url, $podcast_matches);
    return $podcast_matches[1];
  }

  $podcast_id = parse_podcast_id_from_url(urldecode($_GET['podcast_url']));
  $podcast_json = json_decode(file_get_contents("https://itunes.apple.com/lookup?id=$podcast_id&entity=podcast"));

  $podcast_feed_url = $podcast_json->results[0]->feedUrl;
  $podcast_feed_xml = file_get_contents($podcast_feed_url);
  $podcast_feed_json = new SimpleXMLElement($podcast_feed_xml);
  // Convert the end RSS (XML) feed to JSON and return that as the API response
  echo json_encode($podcast_feed_json);

?>
