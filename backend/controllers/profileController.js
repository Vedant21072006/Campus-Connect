import User from "../models/user.js";

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