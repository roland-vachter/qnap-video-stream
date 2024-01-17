import initExpress from "./config/express";

const server = initExpress();

process.on("SIGTERM", () => {
  // eslint-disable-next-line no-console
  console.log("SIGTERM signal received.");
  // eslint-disable-next-line no-console
  console.log("Closing Express Server");
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log("Express server closed.");
  });
});
