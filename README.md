# Faith Dashboard

*Copyright 2021-2022, Caleb Evans*  
*Released under the MIT License*

Be strengthened every day with Faith Dashboard, a private board for your
favorite Bible verses, sermons, and anything else you need to be encouraged
when life happens. Keep it open in a browser tab, and come back to it as needed.

https://faithdashboard.com/

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

### Set up Supabase

First, you need to install Supabase and its dependencies, which you can do
through Homebrew.

```sh
brew install --cask docker
brew install supabase/tap/supabase
open /Applications/Docker.app
```

Then, you need to initialize Supabase and start the Supabase services.

```sh
supabase init
supabase start
```

The `supabase start` command above will output a series of URLs and keys
specific to your local instance of Supabase. Make sure you add the `API URL`
and `anon key` values to your `.env.local` like so:

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:12345
NEXT_PUBLIC_SUPABASE_ANON_KEY=abcdefghijklmnopqrstuvwxyz.1234567890zyxwvutsrqponmlkjihgfedcba
```

### Run app

```sh
next dev
```

The local server will be available at `http://localhost:3000`.
