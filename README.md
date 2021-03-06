# README

This project was created as an assignment for SENG480C: *Creativity Support Tools* at the University of Victoria.

## Design

![design](https://user-images.githubusercontent.com/46540226/161836190-ec7ee54b-29eb-4eae-a94d-1368bbd33667.png)

## Run

Upload the sketch in the `/arduino/` folder to your board. Keep the board connected via USB.

Create the example `.env` file in the project directory:

```sh
export PORT=8080
export WEBSOCKET_PORT=5000
export SERIAL_PORT=9600
export SERIAL_PATH=/dev/ttyS3
```

To test it out, run the following in your terminal:

```sh
cd seng480c-a3
npm i
source .env
node app.mjs
```

And then visit `localhost:8080` in your browser!
