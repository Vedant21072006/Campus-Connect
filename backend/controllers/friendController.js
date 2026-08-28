import Friendship from "../models/freindship.js";
import User from "../models/user.js";

export const sendRequest = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const requesterId = req.user._id;

    // Cannot send request to yourself
    if (requesterId.toString() === recipientId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }

    // Check both directions
    const existingRelationship = await Friendship.findOne({
      $or: [
        {
          requester: requesterId,
          recipient: recipientId,
        },
        {
          requester: recipientId,
          recipient: requesterId,
        },
      ],
    });

    if (existingRelationship) {
      if (existingRelationship.status === "blocked") {
        return res.status(400).json({
          success: false,
          status: "blocked",
          message: "This user is blocked",
        });
      }

      if (existingRelationship.status === "pending") {
        return res.status(400).json({
          success: false,
          status: "pending",
          message: "Friend request already exists",
        });
      }

      if (existingRelationship.status === "accepted") {
        return res.status(400).json({
          success: false,
          status: "accepted",
          message: "You are already friends",
        });
      }

      if (existingRelationship.status === "rejected") {
        // For V1, you can either allow a new request
        // or prevent it. Here we allow a new request.
        existingRelationship.requester = requesterId;
        existingRelationship.recipient = recipientId;
        existingRelationship.status = "pending";

        await existingRelationship.save();

        return res.status(201).json({
          success: true,
          status: "pending",
          message: "Friend request sent",
        });
      }
    }

    // Create new request
    await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      status: "pending",
      message: "Friend request sent",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;

    const friendship = await Friendship.findOne({
      requester: requesterId,
      recipient: req.user._id,
      status: "pending",
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    // Change request status
    friendship.status = "accepted";
    await friendship.save();

    // Update both users' friend counts
    await User.findByIdAndUpdate(requesterId, {
      $inc: {
        "stats.friendsCount": 1,
      },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        "stats.friendsCount": 1,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Friend request accepted",
      friendship,
    });

  } catch (error) {
    // FIX: was "resp" (undefined) — must use "res" (the actual param name).
    // The old code threw a ReferenceError inside the catch block itself,
    // which meant real errors never made it back to the client as a
    // clean 500 response.
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const friendship = await Friendship.findOne({
      _id: requestId,
      recipient: req.user._id,
      status: "pending",
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    await Friendship.findByIdAndDelete(requestId);

    return res.status(200).json({
      success: true,
      message: "Friend request rejected",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const friendship = await Friendship.findOne({
      status: "accepted",
      $or: [
        {
          requester: userId,
          recipient: friendId,
        },
        {
          requester: friendId,
          recipient: userId,
        },
      ],
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: "Friend not found",
      });
    }

    await Friendship.findByIdAndDelete(friendship._id);

    return res.status(200).json({
      success: true,
      message: "Friend removed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Friendship.find({
      recipient: userId,
      status: "pending",
    })
      .populate(
        "requester",
        "firstName lastName username profilePicture college role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Friendship.find({
      requester: userId,
      status: "pending",
    })
      .populate(
        "recipient",
        "firstName lastName username profilePicture college role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getFriends = async (req, res) => {
  try {
    const {userId} =  req.params;

    const friendships = await Friendship.find({
      status: "accepted",
      $or: [
        { requester: userId },
        { recipient: userId },
      ],
    })
      .populate(
        "requester",
        "firstName lastName username profilePicture college role"
      )
      .populate(
        "recipient",
        "firstName lastName username profilePicture college role"
      )
      .sort({ updatedAt: -1 });

    // Return only the OTHER person
    const friends = friendships.map((friendship) => {
      const friend =
        friendship.requester._id.toString() === userId.toString()
          ? friendship.recipient
          : friendship.requester;

      return {
        friendshipId: friendship._id,
        user: friend,
        friendsSince: friendship.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      count: friends.length,
      friends,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getFriendStatus = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    // Don't allow checking yourself
    if (currentUserId.toString() === userId.toString()) {
      return res.status(200).json({
        success: true,
        status: "self",
      });
    }

    const friendship = await Friendship.findOne({
      $or: [
        {
          requester: currentUserId,
          recipient: userId,
        },
        {
          requester: userId,
          recipient: currentUserId,
        },
      ],
    });

    // No relationship
    if (!friendship) {
      return res.status(200).json({
        success: true,
        status: "none",
      });
    }

    // Blocked
    if (friendship.status === "blocked") {
      return res.status(200).json({
        success: true,
        status: "blocked",
      });
    }

    // Already friends
    // NOTE: this returns "accepted" (not "friends") so it matches the
    // Friendship schema's own enum and whatever your PostCard/frontend
    // checks against (friendStatus === "accepted"). If any other part
    // of your codebase (e.g. a feed/post aggregation) attaches
    // friendStatus using different strings like "friends" or
    // "request_sent", the frontend button logic will silently break —
    // keep these strings identical everywhere.
    if (friendship.status === "accepted") {
      return res.status(200).json({
        success: true,
        status: "accepted",
      });
    }

    // Pending request
    if (friendship.status === "pending") {

      const isSentByMe =
        friendship.requester.toString() === currentUserId.toString();

      return res.status(200).json({
        success: true,
        status: "pending",
        direction: isSentByMe ? "sent" : "received",
        requestId: friendship._id,
      });
    }

    return res.status(200).json({
      success: true,
      status: "none",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};