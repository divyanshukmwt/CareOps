import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./db/db.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import publicRoutes from "./routes/public.routes.js";
import inboxRoutes from "./routes/inbox.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import formRoutes from "./routes/form.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import bookingStatusRoutes from "./routes/bookingStatus.routes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// 🔌 Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinWorkspace", (workspaceId) => {
    socket.join(workspaceId);
    console.log(`Joined workspace: ${workspaceId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

app.use("/api/workspaces", workspaceRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/inbox", inboxRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/public", bookingRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/bookings", bookingStatusRoutes);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
