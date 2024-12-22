let io;

const initializeSocket = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

const sendEarningsUpdate = (userId, data) => {
  if (io) {
    io.to(userId.toString()).emit("earningsUpdate", data);
  }
};

module.exports = { initializeSocket, sendEarningsUpdate };
