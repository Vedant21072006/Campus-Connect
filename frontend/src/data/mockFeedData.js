// All static — swap for real API calls once your feed/posts endpoints exist.

export const stories = [
  { id: 1, name: 'Aditya', ring: '#EC4899' },
  { id: 2, name: 'Shruti', ring: '#F59E0B' },
  { id: 3, name: 'Rahul', ring: '#7C3AED' },
  { id: 4, name: 'Ananya', ring: '#10B981' },
]

export const pinnedAnnouncement = {
  title: 'Semester Fest registrations open!',
  description: 'Register before Aug 15. 200+ activities, 3 days of campus celebrations!',
}

export const posts = [
  {
    id: 1,
    author: 'Aditya Sharma',
    meta: 'AI Club · 3rd Year · 2h ago',
    tag: { label: 'Achievement', color: '#F59E0B', style: 'solid' },
    title: 'Built an AI Resume Analyzer',
    description: 'An AI tool that analyzes your resume and gives improvement suggestions.',
    image: true,
    imageLabel: 'Resume Score · 85%',
    likes: 42,
    comments: 12,
    shares: 5,
  },
  {
    id: 2,
    author: 'Shruti Patil',
    meta: 'Design Club · 2h ago',
    tag: { label: 'Question', color: '#7C3AED', style: 'pastel' },
    title: 'Any good resources to learn System Design?',
    description: 'Looking for a roadmap and resources for a beginner.',
    image: false,
    likes: 23,
    comments: 18,
    shares: 0,
  },
  {
    id: 3,
    author: 'GDSC PCU',
    meta: '4h ago',
    tag: { label: 'Event', color: '#3B82F6', style: 'pastel' },
    title: 'Cloud Computing Workshop',
    description: 'Hands-on workshop on AWS Cloud. Register now!',
    image: true,
    imageLabel: 'aws',
    likes: 56,
    comments: 8,
    shares: 12,
  },
  {
    id: 4,
    author: 'Web Dev Community',
    meta: '6h ago',
    tag: null,
    title: 'How I built my first full-stack project',
    description: 'Sharing my journey, challenges and key learnings. Hope this helps someone!',
    image: true,
    imageLabel: '</> Project',
    likes: 31,
    comments: 9,
    shares: 3,
  },
]

export const aiSuggestions = [
  { title: 'Study Partner', desc: 'Find students with same subjects & goals', color: '#7C3AED', icon: 'GraduationCap' },
  { title: 'Project Teammate', desc: 'Find skilled teammates for your projects', color: '#3B82F6', icon: 'Users' },
  { title: 'Internship Buddy', desc: 'Discover internship opportunities', color: '#F59E0B', icon: 'Briefcase' },
  { title: 'Startup Co-founder', desc: 'Find people to build something amazing', color: '#EC4899', icon: 'Rocket', highlight: true },
  { title: 'Find Mentor', desc: 'Connect with seniors & industry experts', color: '#7C3AED', icon: 'UserCheck' },
  { title: 'Like-minded Friends', desc: 'Meet people with similar interests', color: '#EC4899', icon: 'Heart' },
]

export const trending = [
  { title: 'Hackathon 2k25', desc: 'Registration closing soon' },
  { title: 'Google Solution Challenge', desc: 'Registrations open' },
  { title: 'AI/ML Workshop', desc: 'This Saturday' },
  { title: 'Placement Drive', desc: 'For 2025 Batch' },
]

export const leaderboard = [
  { rank: 1, name: 'Rahul', points: '12,450 pts', color: '#F59E0B' },
  { rank: 2, name: 'Ananya', points: '9,870 pts', color: '#C0C0C0' },
  { rank: 3, name: 'Vedant', points: '8,230 pts', color: '#CD7F32' },
]

export const streakDays = 7