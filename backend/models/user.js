import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null,
    },
    collegeName: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1,
      max: 6,
    },
    section: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    city: String,
    state: String,
    country: String,
  },
  { _id: false }
);

const recommendationSchema = new mongoose.Schema(
  {
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    hobbies: [
      {
        type: String,
        trim: true,
      },
    ],
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false }
);

const professionalSchema = new mongoose.Schema(
  {
    resumeUrl: String,
    portfolioUrl: String,
    githubUrl: String,
    linkedinUrl: String,
    codingPlatformUrl: String,
    website: String,
  },
  { _id: false }
);

const privacySchema = new mongoose.Schema(
  {
    profileVisibility: {
      type: String,
      enum: ["public", "college", "friends", "private"],
      default: "college",
    },
    allowMessages: {
      type: Boolean,
      default: true,
    },
    allowFriendRequests: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const statsSchema = new mongoose.Schema(
  {
    postsCount: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    friendsCount: {
      type: Number,
      default: 0,
    },
    communitiesCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // Authentication
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "student",
        "faculty",
        "clubLeader",
        "collegeAdmin",
        "superAdmin",
      ],
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },

    // Basic Information
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    bio: {
      type: String,
      maxlength: 300,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    coverPicture: {
      type: String,
      default: "",
    },

    // College
    college: collegeSchema,

    // Location
    location: locationSchema,

    // Recommendation
    recommendation: recommendationSchema,

    // Professional
    professional: professionalSchema,

    // Privacy
    privacy: privacySchema,

    // Statistics
    stats: statsSchema,

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;