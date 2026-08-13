import User from "../models/user.js";

import cloudinary from "../config/cloudinary.js";


export const completeOnboarding = async (req, resp) => {
    try {

        const userId = req.user._id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,
                onboardingCompleted: true
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return resp.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return resp.status(200).json({
            success: true,
            message: "Onboarding completed successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return resp.status(409).json({
                success: false,
                message: "Username already taken"
            });
        }

        return resp.status(500).json({
            success: false,
            message: "Something went wrong. Please try again."
        });
    }
};

export const getMyProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).select("-passwordHash -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old profile picture from Cloudinary
    if (user.profilePicture?.publicId) {
      await cloudinary.uploader.destroy(
        user.profilePicture.publicId
      );
    }

    // Upload new image
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "campusconnect/profiles/avatars",
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
        .end(req.file.buffer);
    });

    user.profilePicture = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateCoverPicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Cover picture is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete old cover from Cloudinary
    if (user.coverPicture?.publicId) {
      await cloudinary.uploader.destroy(
        user.coverPicture.publicId
      );
    }

    // Upload new cover
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "campusconnect/profiles/covers",
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
        .end(req.file.buffer);
    });

    user.coverPicture = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cover picture updated successfully",
      coverPicture: user.coverPicture,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


