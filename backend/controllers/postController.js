import { ErrorReply, RedisClientPool } from "redis";
import Post from "../models/post.js";
import { success } from "zod";
import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
import Friendship from '../models/freindship.js'
import PostLike from "../models/postLike.js";
import Comment from "../models/comments.js";

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

    const media = []

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
        authorId:authorDetails._id,
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
        media: media,
      },

      postType,
      visibility,
      isOwnPost:true
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
    const currentUserId = req.user._id;

    // ==========================================
    // 1. GET LATEST POSTS
    // ==========================================

    const postdata = await Post.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate(
        "author",
        "firstName lastName username profilePicture role"
      )
      .lean();

    // ==========================================
    // 2. GET UNIQUE AUTHORS FROM THESE POSTS
    // ==========================================

    const authorIds = [
      ...new Set(
        postdata
          .map((post) => post.author?._id?.toString())
          .filter(Boolean)
      ),
    ];

    // ==========================================
    // 3. GET FRIENDSHIPS WITH THESE AUTHORS
    // ==========================================

    const friendships = await Friendship.find({
      $or: [
        {
          requester: currentUserId,
          recipient: { $in: authorIds },
        },
        {
          requester: { $in: authorIds },
          recipient: currentUserId,
        },
      ],
    }).lean();

    // ==========================================
    // 4. CREATE RELATIONSHIP MAP
    // ==========================================

    const relationshipMap = new Map();

    friendships.forEach((friendship) => {
      const requesterId =
        friendship.requester.toString();

      const recipientId =
        friendship.recipient.toString();

      const currentUser =
        currentUserId.toString();

      const otherUserId =
        requesterId === currentUser
          ? recipientId
          : requesterId;

      relationshipMap.set(otherUserId, {
        status: friendship.status,

        direction:
          requesterId === currentUser
            ? "sent"
            : "received",
      });
    });

    // ==========================================
    // 5. GET CURRENT USER'S LIKES
    // ==========================================

    const postIds = postdata.map(
      (post) => post._id
    );

    const likes = await PostLike.find({
      user: currentUserId,
      post: { $in: postIds },
    })
      .select("post")
      .lean();

    // ==========================================
    // 6. CREATE LIKED POST MAP
    // ==========================================

    const likedPostIds = new Set(
      likes.map((like) =>
        like.post.toString()
      )
    );

    // ==========================================
    // 7. ADD RELATIONSHIP + LIKE DATA
    // ==========================================

    const postsWithData = postdata.map((post) => {
      const authorId =
        post.author?._id?.toString();

      const relationship =
        relationshipMap.get(authorId);

      return {
        ...post,

        // Friendship
        friendStatus:
          relationship?.status || "none",

        friendRequestDirection:
          relationship?.direction || null,

        // Like
        isLiked: likedPostIds.has(
          post._id.toString()
        ),
      };
    });

    // ==========================================
    // 8. SEND RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      postdata: postsWithData,
    });

  } catch (error) {
    console.error("Get posts error:", error);

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

export const myPosts = async (req, resp) => {
  try {
    const {id} = req.params
    const posts = await Post.find({
      author: id
    }).sort({ createdAt: -1 })

    return resp.status(201).json({
      success:true,
      posts
    })
  }
  catch (error) {
    return resp.status(500).json({
      message: error.message,
      success: false
    })
  }
}

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Check post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if already liked
    const existingLike = await PostLike.findOne({
      post: postId,
      user: userId,
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: "Post already liked",
        isLiked: true,
      });
    }

    // Create like
    await PostLike.create({
      post: postId,
      user: userId,
    });

    // Increase count
    post.stats.likes += 1;
    await post.save();

    return res.status(201).json({
      success: true,
      message: "Post liked",
      isLiked: true,
      likes: post.stats.likes,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const like = await PostLike.findOneAndDelete({
      post: postId,
      user: userId,
    });

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $inc: {
          "stats.likes": -1,
        },
      },
      {
        new: true,
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post unliked",
      isLiked: false,
      likes: post.stats.likes,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createComment = async (req, resp) => {
  try {
    const { postId } = req.params
    const { content } = req.body
    const userId = req.user._id

    const post = await Post.findById(postId)

    if (!post) {
      return resp.status(404).json({
        message: "Post not found",
        success: false
      })
    }

    let comment = await Comment.create({
      post: postId,
      author: userId,
      content
    })

    // Get only the author information you need
    comment = await comment.populate({
      path: "author",
      select: "username profilePicture"
    })

    return resp.status(201).json({
      message: "Comment created",
      success: true,
      comment
    })

  } catch (error) {
    return resp.status(500).json({
      message: error.message,
      success: false
    })
  }
}

export const getComments = async (req, resp) => {
  try {
    const { postId } = req.params

    const post = await Post.findById(postId)  
    if(!post) {
      return resp.status(404).json({
        message: "Post not found",
        success: false
      })
    }
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author", 
        select: "username profilePicture"
      })
      
    return resp.status(200).json({
      message: "Comments fetched",
      success: true,
      comments
    })  


  }
  catch (error) {
    return resp.status(500).json({
      message: error.message,
      success: false
    })
  }
}

export const deleteComment = async (req, resp) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return resp.status(404).json({
        message: "Comment not found",
        success: false,
      });
    }

    // Only comment author can delete
    if (comment.author.toString() !== userId.toString()) {
      return resp.status(403).json({
        message: "You are not allowed to delete this comment",
        success: false,
      });
    }

    await Comment.findByIdAndDelete(commentId);

    return resp.status(200).json({
      message: "Comment deleted",
      success: true,
    });

  } catch (error) {
    return resp.status(500).json({
      message: error.message,
      success: false,
    });
  }
};