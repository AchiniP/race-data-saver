# race-data-saver 
The main purpose of this project is to fetch data from an external API and save in mongo DB.

The external API simulates horse run events, that runs a new race with six horses every minute
of every day. When a horse starts or finishes, the response is sent out. If no new events have been published within 15
seconds after a request has been made, the request is cancelled, and the simulator returns HTTP status 204.

This Application utilizes node js worker_threads api. 
The worker script subscribes to these race event data returned from the API and saved those data to DB.
Each Child Worker will run in isolation from other workers, with the ability to pass messages between it and the parent worker.

# Table of contents:
- [Pre-reqs](#pre-reqs)
- [Getting started](#getting-started)
- [Dependencies](#dependencies)
- [Assumptions](#assumptions)

# Pre-reqs
- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [Docker](https://docs.docker.com/get-docker/) (If you need ti run in docker env)

# Getting started


## To run Locally 

- Clone the repository
```
git clone https://github.com/AchiniP/race-data-saver.git <project_name>
```

- Install dependencies
```
cd <project_name>
npm install
```

- Build and run the project
```
npm start
```

## To run in Docker

- To start the project in docker environment
```
docker-compose up --build
```
## Unit Tests

- To run the unit tests
```
npm run test
```

# Dependencies
### Additional Libraries added
- axios (Promise based HTTP client)
- mongoose (mongoDB ODM)
- winston (logger library)
- http-status-codes  (Constants enumerating the standard HTTP status codes)

#### dev dependencies
- eslint (for linting)
- jest (for TDD - unit testing)
- mongodb-memory-server (mongodb in memory server for testing)
  
  <br>
  <br>


# Assumptions
### Design Assumptions

Since we dont have any visibility on the server app, Client side polling is implemented.
For this kind of scenario where we need to publish and subscribe the events, 
using websockets/server sent Events (when browser is the client) would be ideal.
