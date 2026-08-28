import mongoose from "mongoose";

const postLikeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can like a post only once
postLikeSchema.index(
  {
    user: 1,
    post: 1,
  },
  {
    unique: true,
  }
);

const PostLike = mongoose.model("PostLike", postLikeSchema);

export default PostLike;