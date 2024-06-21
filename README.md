## How to run
To run the application you need to have the last version of nodejs and mongodb.

To run Mongo you can use docker:

```
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```

Then you need to install dependencies:
```
npm i
```

After that you need to copy/paste `.env.example` and rename it to `.env` and pass values for environment variables.

Finnaly to run app just execute this in terminal:
```
npm run dev
```

## Brief description

The scheduler will schedule 2 each hour jobs.
The first job starts the event.
The second job stops the event after 5 minutes, calculates rewards, and schedules new events.

For the scheduler, I used the `cron` package which internally creates a new process for each job. this will allow jobs to not be hanging out in high loads.

The authentication is implemented via OAuth.

The integration of OAuth took a lot of time because it was my first time integrating OAuth. Because of that, I didn't have enough time to test all the test cases and create a global error handling.