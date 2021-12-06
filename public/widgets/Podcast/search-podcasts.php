<?php
  // This API endpoint is given a search query to search in Apple Podcasts; a
  // list of podcasts are returned, each containing the direct URL to the RSS
  // feed for that respective podcast; the front end will take these feed URLs
  // and later send one of them to the get-podcast.php endpoint

  $search_query_escaped = urlencode($_GET['q']);
  echo file_get_contents("https://itunes.apple.com/search?term=$search_query_escaped&entity=podcast");

?>
