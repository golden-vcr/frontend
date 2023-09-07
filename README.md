# frontend

The **frontend** repo defines `@golden-vcr/frontend`, the codebase for the Golden VCR
frontend webapp.

## Prerequisites

- Install [nvm](https://github.com/nvm-sh/nvm) or
  [nvm-windows](https://github.com/coreybutler/nvm-windows)

## Initial setup

1. Run `nvm install $(cat .nvmrc)` to ensure that the required version of Node is
   installed
2. Run `nvm use` to select that version of Node
3. Run `npm install` to install dependencies

## Development

Run `nvm run dev` to start a development server running at http://localhost:5173/. As
you make changes to the frontend, the app will hot-reload your changes. Thanks to the
dev-server proxy configuration in [`vite.config.ts`](./vite.config.ts), any requests
made to `/api/*` will be proxied to `https://goldenvcr.com/api/*`, with the appropriate
headers injected to prevent CORS errors.
