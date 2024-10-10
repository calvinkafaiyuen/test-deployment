## Hatchery Next.js Website

1. Get .env from @Byron0000
2. Download repo to your computer
3. Install package.json by running: `npm i`


## Setup database - PostgreSQL

1. Download psql: https://postgresapp.com/
2. Download DBeaver as PostgreSQL GUI: https://dbeaver.io/
3. Make sure your database has the following:

   
    `DB_HOST="localhost"`
   
    `DB_USER="postgres"`
   
    `DB_PASSWORD="1234567890"`
   
    `DB_DATABASE="postgres"`
   
    `DB_PORT="5432"` # Default PostgreSQL port (change if necessary)

   
5. Run database via psql and use DBeaver to connect and manage.


## Setup ORM - Prisma

1. Make sure your database is running
2. Create the prisma schema: `npx prisma migrate dev`, if you run into any permission issue just add `sudo` before your commands.
3. Generate the prisma client: `npx prisma generate`
4. Go to your DBeaver and populate data in your `User` table with `prisma/seed.sql` file from this repo


## How to run application

Lastly, after setting up everything from above successfully, you will be able to run application with: `npm run dev`


## Populate your Postgres DB

1. Create a new folder called called `json` inside : `/scripts`.
2. Get the `.json` file from @Byron0000.
3. Make sure your Postgres DB is running.
4. Run `npm run executeSeeding` in your command line.


## Before creating Pull Requests

Make sure you run `npm run build` to make sure you do not have any errors.
If you do, fix them and run the command again. When there no errors, please then create your PR.


## How to run the websocket server for chat (server.js)

1. Run `npm run start:ws` in your command line.