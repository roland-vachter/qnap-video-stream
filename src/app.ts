import initLoadEnv from "./config/env";
import initExpress from "./config/express";

initLoadEnv();

const server = initExpress();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received."); // tslint:disable-line
  console.log("Closing Express Server"); // tslint:disable-line
  server.close(() => {
    console.log("Express server closed."); // tslint:disable-line
  });
});
