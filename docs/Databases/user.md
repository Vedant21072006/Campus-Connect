import mongoose from "mongoose";

/* =========================
   SUB SCHEMAS
========================= */

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
    // Permanent home location
    hometown: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        default: 'India',
      },
    },

    // Temporary current stay location
    current: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        default: 'India',
      },
    },
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
    instagram: String,
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

/* =========================
   NEW ADDITION (NON-BREAKING)
========================= */

const academicProfileSchema = new mongoose.Schema(
  {
    currentSemester: Number,

    interestedDomains: [
      {
        type: String,
        trim: true,
      },
    ],

    lookingFor: [
      {
        type: String,
        enum: [
          "friends",
          "studyPartners",
          "projectTeammates",
          "hackathonTeam",
          "internshipReferrals",
          "mentorship",
          "startupCofounders",
        ],
      },
    ],
  },
  { _id: false }
);

/* =========================
   USER SCHEMA
========================= */

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

    /* =========================
       NEW - ONBOARDING
    ========================= */
onboardingCompleted: {
  type: Boolean,
  default: false,
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
      minlength: 3,
      maxlength: 20,
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

    /* =========================
       NEW - ACADEMIC PROFILE
    ========================= */

    academicProfile: academicProfileSchema,

    // Professional
    professional: professionalSchema,

    // Privacy
    privacy: privacySchema,

    /* =========================
       NEW - PRESENCE
    ========================= */

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: Date,

    // Statistics
    stats: statsSchema,

    // Login tracking
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    /* =========================
       NEW - SEARCH OPTIMIZATION
    ========================= */

    searchKeywords: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* =========================
   INDEXES
========================= */

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ "college.collegeName": 1 });
userSchema.index({ "college.branch": 1 });
userSchema.index({ "college.year": 1 });
userSchema.index({ searchKeywords: 1 });

/* =========================
   VIRTUALS
========================= */

userSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

/* =========================
   HIDE SENSITIVE DATA
========================= */

userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.passwordHash;
  delete obj.__v;

  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;