User
{
    // Authentication
    _id,
    email,
    passwordHash,
    role,
    isVerified,
    accountStatus,

    // Basic
    firstName,
    lastName,
    username,
    bio,

    profilePicture,
    coverPicture,

    // College
    college:{
        collegeId,
        collegeName,
        department,
        branch,
        course,
        year,
        section,
    },

    // Location
    location:{
        city,
        state,
        country
    },

    // Recommendation
    recommendation:{
        interests:[],
        skills:[],
        hobbies:[],
        languages:[] // only foreign languages
    },

    // Professional (optional)
    professional:{
        resumeUrl,
        portfolioUrl,
        githubUrl,
        linkedinUrl,
        codingPlatformUrl,
        website
    },

    // Privacy
    privacy:{
        profileVisibility,
        allowMessages,
        allowFriendRequests
    },

    // Statistics
    stats:{
        postsCount,
        followersCount,
        followingCount,
        friendsCount,
        communitiesCount
    },

 
    lastLogin,

    createdAt,
    updatedAt
}


