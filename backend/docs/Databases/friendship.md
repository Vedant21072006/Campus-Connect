import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "blocked"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);


// Prevent duplicate relationship:
// User A → User B can exist only once
friendshipSchema.index(
  {
    requester: 1,
    recipient: 1,
  },
  {
    unique: true,
  }
);


// Quickly find incoming requests
// "Who has sent me a pending request?"
friendshipSchema.index({
  recipient: 1,
  status: 1,
});


// Quickly find outgoing requests
// "Whom have I sent a pending request to?"
friendshipSchema.index({
  requester: 1,
  status: 1,
});


const Friendship = mongoose.model("Friendship", friendshipSchema);

export default Friendship;