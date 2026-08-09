import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    
    authorSnapshot: {
      username: {
        type: String,
        required: true,
      },

      college: {
        year: {
          type: String,
        },

        course: {
          type: String,
        },

        branch: {
          type: String,
        },
      },

      role: {
        type: String,
      },
    },
    metadata: {
      title: {
        type: String,
        trim: true,
        maxlength: 150,
      },

      description: {
        type: String,
        trim: true,
        maxlength: 5000,
      },

      media: [
        {
          url: {
            type: String,
            required: true,
          },

          publicId: {
            type: String,
          },

          type: {
            type: String,
            enum: ["image", "video"],
            required: true,
          },
        },
      ],
    },

    postType: {
      type: String,
      enum: [
          "GENERAL",
    "QUESTION",
    "EVENT",
    "ACHIEVEMENT"
      ],
      default: "general",
      index: true,
    },

    visibility: {
      type: String,
      enum: ["public", "campus"],
      default: "campus",
      index: true,
    },

    stats: {
      likes: {
        type: Number,
        default: 0,
        min: 0,
      },

      comments: {
        type: Number,
        default: 0,
        min: 0,
      },

      shares: {
        type: Number,
        default: 0,
        min: 0,
      },

      saves: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;