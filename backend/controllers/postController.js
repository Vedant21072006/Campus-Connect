import { ErrorReply, RedisClientPool } from "redis";
import Post from "../models/post.js";
import { success } from "zod";
import User from "../models/user.js";
import cloudinary from "../config/cloudinary.js";
import Friendship from '../models/freindship.js'
import PostLike from "../models/postLike.js";
import Comment from "../models/comments.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      hashtags,
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

    const media = [];

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

    // Normalize hashtags into an array
    let normalizedHashtags = [];

    if (Array.isArray(hashtags)) {
      normalizedHashtags = hashtags;
    } else if (typeof hashtags === "string" && hashtags.trim()) {
      try {
        // Supports a JSON-serialized array from FormData
        const parsed = JSON.parse(hashtags);

        normalizedHashtags = Array.isArray(parsed)
          ? parsed
          : [hashtags];
      } catch {
        normalizedHashtags = [hashtags];
      }
    }

    // Trim whitespace and remove duplicates
    normalizedHashtags = [
      ...new Set(
        normalizedHashtags
          .filter((tag) => typeof tag === "string")
          .map((tag) => tag.trim())
          .filter(Boolean)
      ),
    ];

    const post = await Post.create({
      author: authorDetails._id,

      authorSnapshot: {
        username,
        authorId: authorDetails._id,
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
        media,
      },

      hashtags: normalizedHashtags,

      visibility,
      isOwnPost: true,
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
    const limit = 10;

    const { cursor } = req.query;

    // 1. Build cursor filter
    const filter = {};

    if (cursor) {
      let decodedCursor;

      try {
        decodedCursor = JSON.parse(
          Buffer.from(cursor, "base64url").toString("utf8")
        );
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid pagination cursor",
        });
      }

      const { createdAt, id } = decodedCursor;

      if (
        !createdAt ||
        !id ||
        !mongoose.isValidObjectId(id) ||
        Number.isNaN(Date.parse(createdAt))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid pagination cursor",
        });
      }

      const cursorDate = new Date(createdAt);

      filter.$or = [
        { createdAt: { $lt: cursorDate } },
        {
          createdAt: cursorDate,
          _id: { $lt: new mongoose.Types.ObjectId(id) },
        },
      ];
    }

    // 2. Fetch one extra post to determine hasMore
    const fetchedPosts = await Post.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .populate(
        "author",
        "firstName lastName username profilePicture role"
      )
      .lean();

    const hasMore = fetchedPosts.length > limit;
    const postdata = fetchedPosts.slice(0, limit);

    // 3. Get unique authors
    const authorIds = [
      ...new Set(
        postdata
          .map((post) => post.author?._id?.toString())
          .filter(Boolean)
      ),
    ];

    // 4. Fetch friendships with these authors
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

    // 5. Build relationship map
    const relationshipMap = new Map();

    friendships.forEach((friendship) => {
      const requesterId = friendship.requester.toString();
      const recipientId = friendship.recipient.toString();
      const currentId = currentUserId.toString();

      const otherUserId =
        requesterId === currentId ? recipientId : requesterId;

      relationshipMap.set(otherUserId, {
        status: friendship.status,
        direction:
          requesterId === currentId ? "sent" : "received",
      });
    });

    // 6. Fetch current user's likes for these posts
    const postIds = postdata.map((post) => post._id);

    const likes = await PostLike.find({
      user: currentUserId,
      post: { $in: postIds },
    })
      .select("post")
      .lean();

    const likedPostIds = new Set(
      likes.map((like) => like.post.toString())
    );

    // 7. Attach relationship and like data
    const postsWithData = postdata.map((post) => {
      const authorId = post.author?._id?.toString();
      const relationship = relationshipMap.get(authorId);

      return {
        ...post,
        friendStatus: relationship?.status || "none",
        friendRequestDirection: relationship?.direction || null,
        isLiked: likedPostIds.has(post._id.toString()),
      };
    });

    // 8. Generate cursor from the last returned post
    const lastPost = postdata[postdata.length - 1];

    const nextCursor =
      hasMore && lastPost
        ? Buffer.from(
            JSON.stringify({
              createdAt: lastPost.createdAt.toISOString(),
              id: lastPost._id.toString(),
            })
          ).toString("base64url")
        : null;

    return res.status(200).json({
      success: true,
      postdata: postsWithData,
      pagination: {
        limit,
        hasMore,
        nextCursor,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
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
      count: posts.length,
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