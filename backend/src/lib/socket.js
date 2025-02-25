import { Server } from "socket.io";
import { Message } from "./models/message.model.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const userSocket = new Map(); // {userId: socketId}
  const userActivity = new Map(); // {userId: activity}

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSocket.set(userId, socket.id);
      userActivity.set(userId, "Idle");

      // send user login status to all connected users
      io.emit("user_connected", userId);

      // send online users to all connected users
      socket.emit("users_online", Array.from(userSocket.keys()));

      // send user activities to all connected users
      io.emit("activities", Array.from(userActivity.entries()));
    });

    socket.on("update_activity", (userId, activity) => {
      console.log("update_activity", userId, activity);
      userActivity.set(userId, activity);
      io.emit("activity_updated", userId, activity);
    });
    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({ senderId, receiverId, content });

        // send message to receiver in real-time, if receiver is online
        const receiverSocketId = userSocket.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message_received", message);
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.log("Message error:", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId;

      for (const [userId, socketId] of userSocket.entries()) {
        // find the user who disconnected
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSocket.delete(userId);
          userActivity.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        // send user logout status to all connected users
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });
};
