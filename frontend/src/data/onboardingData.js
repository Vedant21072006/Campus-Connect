// Central place to add/remove onboarding options without touching component logic.
// Note: college names now come from a live API in CollegeStep.jsx, not a static list here.

export const INTERESTS = [
  'Artificial Intelligence',
  'Web Development',
  'App Development',
  'Cybersecurity',
  'Data Science',
  'Cloud Computing',
  'Competitive Programming',
  'Blockchain & Web3',
  'Game Development',
  'Startups & Entrepreneurship',
  'Product Management',
  'Open Source',
  'Hackathons',
  'UI/UX Design',
  'Content Creation',
  'Finance & Investing',
  'Research & Innovation',
  'Personal Growth',
]

export const SKILLS = {
  Technical: [
    'C++', 'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'MongoDB',
    'MySQL', 'Git & GitHub', 'REST APIs', 'Machine Learning', 'Data Analysis',
    'Figma', 'UI Design',
  ],
  'Soft Skills': [
    'Communication', 'Public Speaking', 'Leadership', 'Teamwork',
    'Problem Solving', 'Critical Thinking', 'Time Management',
    'Project Management', 'Networking', 'Creativity',
  ],
}

export const HOBBY_GROUPS = {
  Outdoors: ['Trekking', 'Hiking', 'Cycling', 'Camping', 'Stargazing'],
  Creative: ['Pottery', 'Photography', 'Videography', 'Sketching', 'Painting'],
  Social: ['Board Games', 'Chess', 'Book Clubs', 'Cafe Hopping', 'Volunteering', 'Event Organizing', 'Cooking'],
  'Performing Arts': ['Public Speaking', 'Theatre', 'Dance', 'Singing', 'Guitar'],
  Sports: ['Football', 'Badminton'],
}