import BookingForm from "../models/bookingForm.models.js";
import Form from "../models/form.models.js";

/**
 * PUBLIC: Get post-booking form using PUBLIC ID
 * URL: /form/:bookingFormPublicId
 */
export const getPublicForm = async (req, res) => {
  try {
    const { bookingFormPublicId } = req.params;

    // 🔍 LOOKUP (THIS IS THE KEY PART)
    const bookingForm = await BookingForm.findOne({
      publicId: bookingFormPublicId,
    }).populate("formId");

    if (!bookingForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({
      bookingFormId: bookingForm._id, // internal only
      form: bookingForm.formId,       // fields + labels
    });
  } catch (error) {
    console.error("Get public form error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUBLIC: Submit post-booking form using PUBLIC ID
 * URL: /form/:bookingFormPublicId
 */
export const submitPublicForm = async (req, res) => {
  try {
    const { bookingFormPublicId } = req.params;

    // 🔍 LOOKUP
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
    console.error("Submit form error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: Create a form (internal)
 */
export const createForm = async (req, res) => {
  try {
    const { workspaceId, title, description, fields } = req.body;

    if (!workspaceId || !title || !fields) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const form = await Form.create({
      workspaceId,
      title,
      description,
      fields,
    });

    res.status(201).json({
      message: "Form created successfully",
      form,
    });
  } catch (error) {
    console.error("Create form error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
