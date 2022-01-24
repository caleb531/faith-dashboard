# Faith Dashboard

*Copyright 2021-2022, Caleb Evans*  
*Released under the MIT License*

This app is designed to be a central dashboard for displaying your favorite
verses, notes, sermons, or other things that strengthen your faith.

**This project is currently in development; things may change or break at any time.**

[Live Demo](https://faithdashboard.com/)

## Setup

### Install npm packages

```sh
npm install
```

### Obtain ESV API token (for use in the Bible app widget)

In order for the Bible app widget to function locally, you must obtain an API
token for the [ESV API](https://api.esv.org/). Once you have it, create a file
called `.env` in the root of your repository with the following contents:

```
ESV_API_KEY=PASTE_YOUR_API_TOKEN_HERE
```

### Run app

```sh
gulp serve
```

The local server will be available at `http://localhost:8080`.
