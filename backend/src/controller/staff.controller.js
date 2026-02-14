import AllowedStaff from "../models/allowedStaff.models.js";
import User from "../models/user.models.js";

/* DEFAULT PERMISSIONS (SINGLE SOURCE OF TRUTH) */
const DEFAULT_PERMISSIONS = {
  inbox: true,
  bookings: true,
  forms: false,
  inventory: false,
};

/* ADD STAFF */
export const addStaff = async (req, res) => {
  try {
    if (req.user.role !== "OWNER") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { email, post } = req.body;
    const workspaceId = req.user.workspaceId;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const exists = await AllowedStaff.findOne({ email, workspaceId });
    if (exists) {
      return res.status(400).json({ message: "Staff already added" });
    }

    await AllowedStaff.create({
      email,
      workspaceId,
      post,
      permissions: DEFAULT_PERMISSIONS,
    });

    res.json({ message: "Staff added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* LIST STAFF (🔥 FIX IS HERE) */
export const listStaff = async (req, res) => {
  try {
    if (req.user.role !== "OWNER") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const staff = await AllowedStaff.find({
      workspaceId: req.user.workspaceId,
    }).lean();

    const users = await User.find({
      workspaceId: req.user.workspaceId,
      role: "STAFF",
    }).select("email");

    const registeredEmails = users.map((u) => u.email);

    const result = staff.map((s) => ({
      ...s,
      permissions: s.permissions || DEFAULT_PERMISSIONS, // ✅ FORCE DEFAULT
      status: registeredEmails.includes(s.email)
        ? "Registered"
        : "Pending",
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* UPDATE PERMISSION */
export const updateStaffPermission = async (req, res) => {
  try {
    if (req.user.role !== "OWNER") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { staffId, permission, value } = req.body;

    const staff = await AllowedStaff.findOne({
      _id: staffId,
      workspaceId: req.user.workspaceId,
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.permissions = {
      ...DEFAULT_PERMISSIONS,
      ...staff.permissions,
      [permission]: value,
    };

    await staff.save();

    res.json({ message: "Permission updated" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
