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
    return resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectRequest = async (req, resp) => {
  try {
    const { requestId } = req.params;

    const friendship = await Friendship.findOne({
      _id: requestId,
      recipient: req.user._id,
      status: "pending",
    });

    if (!friendship) {
      return resp.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    await Friendship.findByIdAndDelete(requestId);

    return resp.status(200).json({
      success: true,
      message: "Friend request rejected",
    });

  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFriend = async (req, resp) => {
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
      return resp.status(404).json({
        success: false,
        message: "Friend not found",
      });
    }

    await Friendship.findByIdAndDelete(friendship._id);

    return resp.status(200).json({
      success: true,
      message: "Friend removed successfully",
    });

  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getIncomingRequests = async (req, resp) => {
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

    return resp.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getSentRequests = async (req, resp) => {
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

    return resp.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getFriends = async (req, resp) => {
  try {
    const userId = req.user._id;

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

    return resp.status(200).json({
      success: true,
      count: friends.length,
      friends,
    });

  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getFriendStatus = async (req, resp) => {
  try {
    const currentUserId = req.user._id;
    const { userId } = req.params;

    // Don't allow checking yourself
    if (currentUserId.toString() === userId.toString()) {
      return resp.status(200).json({
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
      return resp.status(200).json({
        success: true,
        status: "none",
      });
    }

    // Blocked
    if (friendship.status === "blocked") {
      return resp.status(200).json({
        success: true,
        status: "blocked",
      });
    }

    // Already friends
    if (friendship.status === "accepted") {
      return resp.status(200).json({
        success: true,
        status: "friends",
      });
    }

    // Pending request
    if (friendship.status === "pending") {

      const isSentByMe =
        friendship.requester.toString() === currentUserId.toString();

      return resp.status(200).json({
        success: true,
        status: isSentByMe
          ? "request_sent"
          : "request_received",
        requestId: friendship._id,
      });
    }

    return resp.status(200).json({
      success: true,
      status: "none",
    });

  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};