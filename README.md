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

## Deployment

Once the frontend app is built, it's deployed to an S3-compatible `frontend` bucket in
DigitalOcean Spaces. Before you can deploy the app, you'll need to write a `deploy.env`
file containing the environment variables required in [`deploy.js`](./deploy.js): if
you've cloned the [terraform](https://github.com/golden-vcr/terraform) repo alongside
this one, simply open a shell in the root of that repo and run
`terraform output -raw frontend_s3_env > ../frontend/deploy.env`.

Once you have a valid `deploy.env` file, simply run `npm run deploy` to make a new
build and deploy it to [goldenvcr.com](https://goldenvcr.com).
