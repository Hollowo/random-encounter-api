# Random Encounter API

API to use in the client of the application

# How to Startup

Define your environment variables in a `.env` file, following the `.env.example `.

Setup a database to the Prisma,

```sh
$ npx prisma generate
$ npx prisma db push
```

Startup the application (it will run the the port **3001** by default)

```sh
$ yarn start:dev
```

You can find all the documentation for the available endpoints in `<your-host>/api` (eg. http://localhost:3001/api)
