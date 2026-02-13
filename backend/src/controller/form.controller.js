import BookingForm from "../models/bookingForm.models.js";
import Form from "../models/form.models.js";
import Workspace from "../models/workspace.models.js";

/* ===============================
   GET PUBLIC FORM (CUSTOMER)
================================ */
export const getPublicForm = async (req, res) => {
  try {
    const { bookingFormPublicId } = req.params;

    const bookingForm = await BookingForm.findOne({
      publicId: bookingFormPublicId,
    }).populate("formId");

    if (!bookingForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({
      bookingFormId: bookingForm._id,
      form: bookingForm.formId,
    });
  } catch (error) {
    console.error("Get public form error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   SUBMIT PUBLIC FORM (CUSTOMER)
================================ */
export const submitPublicForm = async (req, res) => {
  try {
    const { bookingFormPublicId } = req.params;

    const bookingForm = await BookingForm.findOne({
      publicId: bookingFormPublicId,
    });

    if (!bookingForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    bookingForm.responseData = req.body;
    bookingForm.status = "COMPLETED";
    bookingForm.submittedAt = new Date();

    await bookingForm.save();

    res.json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Submit public form error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   CREATE FORM (ADMIN)
================================ */
export const createForm = async (req, res) => {
  try {
    // 🔐 MUST HAVE WORKSPACE
    if (!req.user.workspaceId) {
      return res
        .status(400)
        .json({ message: "Workspace not linked to user" });
    }

    const { title, description, fields } = req.body;

    if (!title || !fields || fields.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const form = await Form.create({
      workspaceId: req.user.workspaceId,
      title,
      description,
      fields,
    });

    res.status(201).json(form);
  } catch (error) {
    console.error("Create form error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   GET FORMS (ADMIN)
================================ */
export const getForms = async (req, res) => {
  try {
    // 🔐 MUST HAVE WORKSPACE
    if (!req.user.workspaceId) {
      return res
        .status(400)
        .json({ message: "Workspace not linked to user" });
    }

    const forms = await Form.find({
      workspaceId: req.user.workspaceId,
    }).sort({ createdAt: -1 });

    res.json(forms);
  } catch (error) {
    console.error("Get forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPublicFormsByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const forms = await Form.find({ workspaceId }).select("title _id");

    res.json(forms);
  } catch (error) {
    console.error("Get public forms error:", error);
    res.status(500).json({ message: "Server error" });
  }
};