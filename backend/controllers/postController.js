import { ErrorReply } from "redis";
import Post from "../models/post.js";
import { success } from "zod";
import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      postType,
      visibility,
    } = req.body;

    const authorDetails = await User.findById(req.user._id);

    if (!authorDetails) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    const { username, college, role } = authorDetails;

    const media=[]

       if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "campusconnect/posts",
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            )
            .end(file.buffer);
        });

        media.push({
          url: result.secure_url,
          publicId: result.public_id,
          type: "image",
        });
      }
    }

    const post = await Post.create({
      author: authorDetails._id,

      authorSnapshot: {
        username,
        college: {
          year: college?.year,
          course: college?.course,
          branch: college?.branch,
        },
        role,
      },

      metadata: {
        title,
        description,
        media: media ,
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

  
    return res.status(200).json({
      success: true,
      postdata
   
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Make sure the logged-in user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};