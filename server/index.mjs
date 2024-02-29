import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const server = fastify();

const wss = new WebSocketServer({
  port: 1122,
});

wss.on("connection", (client) => {
  client.on("message", (data) => {
    try {
      const user = JSON.parse(data);
      const avatar = user.name[0].toUpperCase() + user.surname[0].toUpperCase();
      
      wss.clients.forEach((cl) => {
        if (cl !== client) {
          cl.send(
            JSON.stringify({
              avatar: avatar,
              message: user.message,
              date: Date.now(),
              isNotMyMessage: true,
            })
          );
        } else {
          cl.send(
            JSON.stringify({
              message: user.message,
              date: Date.now(),
              isNotMyMessage: false,
            })
          );
        }
      });
    } catch (error) {
      console.error("Ошибка", error);
    }
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

server.register(fastifyStatic, {
  root: join(__dirname, "../build"),
});

server
  .listen({ port: 1234 })
  .then((adress) => console.log("server started at " + adress))
  .catch((err) => {
    console.log("Error " + err);
  });
