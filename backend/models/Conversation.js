import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group", "community"],
      default: "direct",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Used to make sure two users have only one direct conversation
    participantKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    // Useful later for groups/communities
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    avatar: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },

    // Last message reference for quickly showing
    // the latest message in the conversation list
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({
  participants: 1,
  lastMessageAt: -1,
});

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;