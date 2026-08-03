import { useState } from 'react'
import {
  Rocket, ArrowLeft, GraduationCap, Sparkles, Briefcase,
  Users2, Home as HomeIcon, Grid3x3, Trophy, FolderGit2, Star, Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProfileHeader from '../components/profile/ProfileHeader.jsx'
import SectionTabs from '../components/profile/SectionTabs.jsx'
import AboutSection from '../components/profile/sections/AboutSection.jsx'
import InterestsSkillsSection from '../components/profile/sections/InterestsSkillsSection.jsx'
import ProfessionalSection from '../components/profile/sections/ProfessionalSection.jsx'
import SocialSection from '../components/profile/sections/SocialSection.jsx'
import CommunitiesSection from '../components/profile/sections/CommunitiesSection.jsx'
import PostsSection from '../components/profile/sections/PostsSection.jsx'
import ComingSoonSection from '../components/profile/sections/ComingSoonSection.jsx'
import { mockProfileData } from '../data/mockProfileData.js'

// Add/remove/reorder a section here — everything else (tab bar + content switch) follows automatically.
const SECTIONS = [
  { key: 'about', label: 'About', icon: GraduationCap },
  { key: 'interests', label: 'Interests & Skills', icon: Sparkles },
  { key: 'professional', label: 'Professional', icon: Briefcase },
  { key: 'social', label: 'Social', icon: Users2 },
  { key: 'communities', label: 'Communities', icon: HomeIcon },
  { key: 'posts', label: 'Posts', icon: Grid3x3 },
  { key: 'achievements', label: 'Achievements', icon: Trophy },
  { key: 'projects', label: 'Projects', icon: FolderGit2 },
]

// TODO: replace with `const { data, isOwner } = useProfile(username)` once you have a real GET endpoint.
export default function Profile() {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(mockProfileData)
  const [activeTab, setActiveTab] = useState('about')
  const isOwner = true // flip to false to preview how another user's profile would render

  const handleImageChange = (field, dataUrl) => {
    setProfileData((prev) => ({ ...prev, [field]: dataUrl }))
    // TODO: upload the file to your backend/Cloudinary here and persist the returned URL.
  }

  const renderSection = () => {
    switch (activeTab) {
      case 'about':
        return <AboutSection data={profileData} />
      case 'interests':
        return <InterestsSkillsSection data={profileData} />
      case 'professional':
        return <ProfessionalSection data={profileData.professional} />
      case 'social':
        return <SocialSection data={profileData} isOwner={isOwner} />
      case 'communities':
        return <CommunitiesSection data={profileData} />
      case 'posts':
        return <PostsSection data={profileData} isOwner={isOwner} />
      case 'achievements':
        return (
          <ComingSoonSection
            icon={Trophy}
            title="Achievements"
            description="Badges, hackathon wins, certifications, and campus roles will show up here once this feature ships."
            previewLabels={['🏆 Hackathon Winner', '🔥 30-day streak', '🎖 Campus Ambassador', '📜 Certified']}
          />
        )
      case 'projects':
        return (
          <ComingSoonSection
            icon={FolderGit2}
            title="Projects"
            description="Feature your best work and open-source contributions right on your profile."
            previewLabels={['Featured Project', 'Open Source PR', 'Hackathon Build']}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-cream font-body">
      <nav className="sticky top-0 z-30 bg-cream border-b-[3px] border-ink">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="font-display font-semibold text-sm flex items-center gap-1.5 bg-white border-[3px] border-ink px-3 py-1.5 rounded-full shadow-hard-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2 font-display font-semibold">
            <Rocket className="text-bubblegum" size={20} />
            CampusConnect
          </div>
          <div className="w-16" /> {/* spacer to balance the Back button */}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 relative">
        <div className="absolute top-24 -left-6 w-14 h-14 bg-sunny rounded-full border-[3px] border-ink hidden lg:block -z-0" />
        <div className="absolute top-96 -right-8 w-16 h-16 bg-sky rotate-12 border-[3px] border-ink hidden lg:block -z-0" />
        <Star className="absolute top-10 -right-4 text-lime hidden lg:block" size={22} fill="#B8E62D" />
        <Zap className="absolute bottom-24 -left-8 text-bubblegum hidden lg:block" size={24} fill="#FF6B9D" />

        <div className="relative z-10">
          <ProfileHeader data={profileData} isOwner={isOwner} onImageChange={handleImageChange} />
          <SectionTabs sections={SECTIONS} activeTab={activeTab} onChange={setActiveTab} />
          <div key={activeTab} className="animate-[fadeIn_0.2s_ease-out]">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  )
}