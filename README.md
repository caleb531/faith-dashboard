# Faith Dashboard

_Copyright 2021-2023, Caleb Evans_  
_Released under the MIT License_

[![tests](https://github.com/caleb531/faith-dashboard/actions/workflows/tests.yml/badge.svg)](https://github.com/caleb531/faith-dashboard/actions/workflows/tests.yml)
[![Coverage Status](https://coveralls.io/repos/github/caleb531/faith-dashboard/badge.svg?branch=develop)](https://coveralls.io/github/caleb531/faith-dashboard?branch=develop)

Be strengthened every day with Faith Dashboard, a private board for your
favorite Bible verses, sermons, and anything else you need to be encouraged
when life happens. Keep it open in a browser tab, and come back to it as needed.

https://faithdashboard.com/

## Setup

### Install packages

This project uses [pnpm][pnpm] (instead of npm) for package installation and
management.

[pnpm]: https://pnpm.io/

```sh
npm install -g pnpm
pnpm install
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
pnpm exec next dev
```

The local server will be available at `http://localhost:3000`.
