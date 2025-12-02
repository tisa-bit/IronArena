import http from "http";
import app from "../app.js";

const normalizeport = (val) => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    return val;
  }
  if (port < 0) {
    console.log("info", "port number must be greater than or equal to zero");
    process.exit(1);
  }
  return port;
};

const port = normalizeport(process.env.PORT || "5007");
app.set("port", port);
const server = http.createServer(app);
const Errorhandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? `pipe ${address}` : `port:${port}`;
  switch (error.code) {
    case "EACCES":
      console.log(`${bind} requires elevated privilages`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

server.on("error", Errorhandler);

server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? `pipe ${address}` : port;
  console.log(`server started succesfully on port : ${bind}`);
  console.log(`App:http://localhost:${bind}`);
  console.log(`Swagger:http://localhost:${bind}/api-docs`);
});
server.listen(port);
