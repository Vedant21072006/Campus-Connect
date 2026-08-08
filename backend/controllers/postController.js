import { ErrorReply } from "redis";
import Post from "../models/post.js";
import { success } from "zod";
import User from "../models/user.js";

export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      media,
      postType,
      visibility,
    } = req.body;

    const post = await Post.create({
      author: req.user._id,

      metadata: {
        title,
        description,
        media: media || [],
      },

      postType,
      visibility,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const postdata = await Post.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const userdata = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      postdata,
      userdata,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};