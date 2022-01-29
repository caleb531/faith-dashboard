# Faith Dashboard

*Copyright 2021-2022, Caleb Evans*  
*Released under the MIT License*

Faith Dashboard is a private board for your favorite Bible verses, sermons, and
anything you'd like. Come back to it whenever you need encouragement, wisdom,
or simple truth.

[Live App](https://faithdashboard.com/)

## Setup

### Install npm packages

```sh
npm install
```

### Obtain ESV API token (for use in the Bible widget)

In order for the Bible widget to function locally, you must obtain an API token
for the [ESV API](https://api.esv.org/). Once you have it, create a file called
`.env.local` in the root of your repository with the following contents:

```
ESV_API_KEY=PASTE_YOUR_API_TOKEN_HERE
```

### Run app

```sh
next dev
```

The local server will be available at `http://localhost:3000`.
