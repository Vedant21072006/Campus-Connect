// Swap this for a real `fetch(\`${apiUrl}/profile/me\`)` call once your GET endpoint exists.
// Shape mirrors the User schema + onboarding formData exactly, so wiring real data later
// is a drop-in replacement, not a rewrite.

export const mockProfileData = {
  profilePicture: '',
  coverPicture: '',
  firstName: 'Vedant',
  lastName: 'Rao',
  username: 'vedant_r',
  bio: '2nd year CSE @ PCU. Building CampusConnect. MERN + DSA + occasionally AI things.',

  college: {
    collegeName: 'Pimpri Chinchwad University',
    department: 'Computer Science Engineering',
    branch: 'CSE',
    course: 'B.Tech',
    year: '2',
    section: 'A',
  },

  location: {
    city: 'Pune',
    homeTown: '',
  },

  recommendation: {
    interests: ['Artificial Intelligence', 'Web Development', 'Competitive Programming', 'Hackathons'],
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Git & GitHub', 'Problem Solving'],
    hobbies: ['Chess', 'Cafe Hopping', 'Cycling'],
    languages: ['English', 'Hindi', 'Marathi'],
  },

  professional: {
    githubUrl: 'https://github.com/vedantr',
    linkedinUrl: 'https://linkedin.com/in/vedantr',
    portfolioUrl: '',
    resumeUrl: '',
    website: '',
    codingPlatformUrl: 'https://leetcode.com/vedantr',
  },

  stats: {
    postsCount: 12,
    friendsCount: 48,
    communitiesCount: 5,
    followersCount: 0,
    followingCount: 0,
    profileViews: 0,
  },

  social: {
    friendStatus: 'owner', // 'owner' | 'friends' | 'pending' | 'add'
    friends: [
      { id: 1, name: 'Aarav Sharma', username: 'aarav_s' },
      { id: 2, name: 'Zara Khan', username: 'zarak' },
      { id: 3, name: 'Kabir Mehta', username: 'kabirm' },
      { id: 4, name: 'Anaya Iyer', username: 'anaya_i' },
    ],
    mutualFriends: [],
  },

  communities: {
    joined: [
      { id: 1, name: 'Coding Club', members: 320 },
      { id: 2, name: 'ECE Batch \'26', members: 180 },
      { id: 3, name: 'Placement Cell', members: 900 },
    ],
    created: [
      { id: 4, name: 'DSA Grinders', members: 45 },
    ],
  },

  posts: {
    own: [
      { id: 1, caption: 'Shipped the onboarding flow for CampusConnect 🚀', likes: 34 },
      { id: 2, caption: 'Finally cracked graphs pattern-wise on LeetCode', likes: 21 },
    ],
    saved: [],
    liked: [],
  },

  achievements: {
    badges: [],
    hackathonWins: [],
    certifications: [],
    streaks: 7,
    campusRoles: [],
  },

  projects: {
    featured: [],
    openSource: [],
  },

  joinedDate: '2025-08-14',
  lastActive: '2026-08-02',
}