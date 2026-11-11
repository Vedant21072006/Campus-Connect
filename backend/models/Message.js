import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
    },

    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    // We'll use this later when we add optimistic/socket messages
    clientMessageId: {
      type: String,
      default: null,
      index: true,
    },

    // V1 can use this for delivery tracking later
    deliveredTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    deleted: {
      type: Boolean,
      default: false,
    },

    edited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({
  conversation: 1,
  createdAt: -1,
});

const Message =
  mongoose.models.Message ||
  mongoose.model("Message", messageSchema);

export default Message;