import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./db/db.js";

import workspaceRoutes from "./routes/workspace.routes.js";
import publicRoutes from "./routes/public.routes.js";
import inboxRoutes from "./routes/inbox.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import bookingStatusRoutes from "./routes/bookingStatus.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import formRoutes from "./routes/form.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import authRoutes from "./routes/auth.routes.js";
import staffRoutes from "./routes/staff.routes.js";


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("joinWorkspace", (workspaceId) => {
    socket.join(workspaceId);
  });
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/inbox", inboxRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/bookings", bookingStatusRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/staff", staffRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
