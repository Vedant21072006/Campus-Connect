import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, UserCircle2, GraduationCap, Sparkles, Zap, Heart, Link2, PartyPopper, ArrowLeft, ArrowRight } from 'lucide-react'
import ProgressBar from '../components/onboarding/ProgressBar.jsx'
import BasicInfoStep from '../components/onboarding/BasicInfoStep.jsx'
import CollegeStep from '../components/onboarding/CollegeStep.jsx'
import InterestsStep from '../components/onboarding/InterestsStep.jsx'
import SkillsStep from '../components/onboarding/SkillsStep.jsx'
import HobbiesStep from '../components/onboarding/HobbiesStep.jsx'
import ProfessionalStep from '../components/onboarding/ProfessionalStep.jsx'
import ReviewStep from '../components/onboarding/ReviewStep.jsx'
import Toast from '../components/Toast.jsx'

// Add or remove a step here — order in this array drives the whole flow.
const STEPS = [
  { key: 'basic', title: "Let's start with the basics", icon: UserCircle2 },
  { key: 'college', title: 'Where do you study?', icon: GraduationCap },
  { key: 'interests', title: 'What are you into?', icon: Sparkles },
  { key: 'skills', title: 'What can you bring to the table?', icon: Zap },
  { key: 'hobbies', title: 'How do you like to spend your time?', icon: Heart },
  { key: 'professional', title: 'Show off your work', icon: Link2 },
  { key: 'review', title: "You're all set!", icon: PartyPopper },
]

const initialFormData = {
  firstName: '',
  lastName: '',
  username: '',
  bio: '',
  college: {
    collegeName: '',
    department: '',
    branch: '',
    course: '',
    year: '',
    section: '',
  },
  recommendation: {
    interests: [],
    skills: [],
    hobbies: [],
  },
  professional: {
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
    website: '',
  },
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Onboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const totalSteps = STEPS.length
  const step = STEPS[currentStep - 1]
  const StepIcon = step.icon
  const isReview = step.key === 'review'

  // --- field updaters: kept flat so child components stay purely presentational ---
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateCollegeField = (field, value) => {
    setFormData((prev) => ({ ...prev, college: { ...prev.college, [field]: value } }))
  }

  const updateProfessionalField = (field, value) => {
    setFormData((prev) => ({ ...prev, professional: { ...prev.professional, [field]: value } }))
  }

  const toggleListItem = (listName, item, max) => {
    setFormData((prev) => {
      const current = prev.recommendation[listName]
      const exists = current.includes(item)
      if (!exists && current.length >= max) {
        setToast({ message: `You can only pick up to ${max}!`, type: 'error' })
        return prev
      }
      const updated = exists ? current.filter((i) => i !== item) : [...current, item]
      return { ...prev, recommendation: { ...prev.recommendation, [listName]: updated } }
    })
  }

  // --- validation, one branch per step that needs it ---
  const validateStep = () => {
    if (step.key === 'basic' && (!formData.firstName || !formData.lastName || !formData.username)) {
      setToast({ message: 'Fill in your name and username to continue.', type: 'error' })
      return false
    }
    if (step.key === 'college' && (!formData.college.collegeName || !formData.college.department)) {
      setToast({ message: 'Tell us your college and department.', type: 'error' })
      return false
    }
    if (step.key === 'interests' && formData.recommendation.interests.length === 0) {
      setToast({ message: 'Pick at least one interest.', type: 'error' })
      return false
    }
    if (step.key === 'skills' && formData.recommendation.skills.length === 0) {
      setToast({ message: 'Pick at least one skill.', type: 'error' })
      return false
    }
    return true
  }

  const goNext = () => {
    if (!validateStep()) return
    setCurrentStep((s) => Math.min(s + 1, totalSteps))
  }

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/profile/complete-onboarding`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to save profile')
      setToast({ message: 'Profile complete! Welcome to campus 🎉', type: 'success' })
      setTimeout(() => navigate('/feed'), 1200)
    } catch (err) {
      setToast({ message: "Couldn't save your profile. Try again.", type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step.key) {
      case 'basic':
        return <BasicInfoStep data={formData} onChange={updateField} />
      case 'college':
        return <CollegeStep data={formData.college} onChange={updateCollegeField} />
      case 'interests':
        return <InterestsStep selected={formData.recommendation.interests} onToggle={(item) => toggleListItem('interests', item, 5)} />
      case 'skills':
        return <SkillsStep selected={formData.recommendation.skills} onToggle={(item) => toggleListItem('skills', item, 8)} />
      case 'hobbies':
        return <HobbiesStep selected={formData.recommendation.hobbies} onToggle={(item) => toggleListItem('hobbies', item, 5)} />
      case 'professional':
        return <ProfessionalStep data={formData.professional} onChange={updateProfessionalField} />
      case 'review':
        return <ReviewStep formData={formData} onSubmit={handleSubmit} loading={loading} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 sm:px-6 py-10 relative overflow-hidden font-body">
      <div className="absolute top-16 left-14 w-16 h-16 bg-sunny rounded-full border-[3px] border-ink hidden md:block" />
      <div className="absolute bottom-16 right-16 w-20 h-20 bg-sky rotate-12 border-[3px] border-ink hidden md:block" />

      <div className="relative bg-white rounded-3xl border-[3px] border-ink shadow-hard-lg w-full max-w-xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-bubblegum rounded-xl border-[3px] border-ink flex items-center justify-center shrink-0">
            <Rocket size={18} />
          </div>
          <span className="font-display font-semibold text-lg">CampusConnect</span>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="flex items-center gap-2 mb-6">
          <StepIcon size={20} className="text-bubblegum shrink-0" />
          <h1 className="font-display text-lg sm:text-xl font-semibold">{step.title}</h1>
        </div>

        <div key={step.key} className="animate-[fadeIn_0.25s_ease-out]">
          {renderStep()}
        </div>

        {!isReview && (
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 1}
              className="font-display font-semibold text-sm flex items-center gap-1.5 bg-white border-[3px] border-ink px-4 py-2.5 rounded-xl shadow-hard-sm disabled:opacity-30 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="font-display font-semibold text-sm flex items-center gap-1.5 bg-sunny border-[3px] border-ink px-5 py-2.5 rounded-xl shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        )}
        {isReview && currentStep > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="font-display font-semibold text-sm flex items-center gap-1.5 bg-white border-[3px] border-ink px-4 py-2.5 rounded-xl shadow-hard-sm mt-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}