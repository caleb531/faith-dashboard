<?php
  // This API endpoint is given the URL to an Apple Podcasts RSS feed, which then converts the XML data for that feed to JSON and returns the result

  $podcast_feed_url = $_GET['feed_url'];
  $podcast_feed_xml = file_get_contents($podcast_feed_url);
  $podcast_feed_json = new SimpleXMLElement($podcast_feed_xml);
  // Convert the end RSS (XML) feed to JSON and return that as the API response
  echo json_encode($podcast_feed_json);

?>
