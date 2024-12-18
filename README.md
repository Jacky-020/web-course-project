# webapp-estr2106

Webapp project for the ESTR2106 course: Building Web Applications.

## Organization

### Backend

Backend and API related code is in the `src/api` directory. [`index.ts`](src/api/index.ts) contains the entrypoint of the api. You may make a new script in the `src/api` directory and import it in [`index.ts`](src/api/index.ts) to add new routes. All API routes will by default be prefixed with `/api/` on the server. (See [`server.ts`](server.ts)).

### Frontend

Any paths not caught by the API will be served by the frontend. Frontend code is in `src/`. The entrypoint of the frontend is [`main.tsx`](src/main.tsx). You may add new pages by creating a new folder in `src` and adding a new route in [`main.tsx`](src/main.tsx). Components used in multiple pages can be placed in the `src/components` directory.

## Deployment

Start MongoDB server:

```bash
docker-compose up -d
```

Alternatively you can start the MongoDB using MongoDB Compass or the MongoDB shell as long as the connection url is `mongodb://127.0.0.1:27017/webapp`. You can configure the value in `.env.dev`. Please use an empty database to avoid errors and bugs.

Start development server:

```bash
npm run dev
```

## Usage
Access the frontend at http://localhost:5173/

Login the server with a User account:
Username: player1
Password: readysetgo

or an Admin account:
Username: admin
Password: admin

After logging in, please enable locations permissions on the browser.

If you are the admin, you can access the admin panel on the top left corner to perform CRUD operations.

Please refer to the project report for more guidance.
