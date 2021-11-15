# Faith Dashboard

*Copyright 2021, Caleb Evans*  
*Released under the MIT License*

This app is designed to be a central dashboard for displaying your favorite
verses, notes, sermons, or other things that strengthen your faith.

**This project is currently in development; things may change or break at any time.**

[Live Demo](https://projects.calebevans.me/faith-dashboard/)

## Setup

### Install npm packages

```sh
npm install
```

### Obtain ESV API token (for use in the Bible app widget)

In order for the Bible app widget to function locally, you must obtain an API
token for the ESV API. Once you have it, create a file called `api.json` under
`public/widgets/BibleVerse/` with the following contents:

```json
{
  "api_token": "YOUR_API_TOKEN_HERE"
}
```

### Run app

Currently, because the ESV API does not support CORS, a PHP script is used to
proxy requests to the API.

This implies that the project will only run via Apache or nginx if you want to
use the Bible Verse widget. But otherwise, you can run the local server like so:

```sh
gulp serve
```

The local server will be available at `http://localhost:8080`.
