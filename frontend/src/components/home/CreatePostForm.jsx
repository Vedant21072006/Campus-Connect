import { useRef, useState } from 'react'
import {
  ArrowLeft, Send, BadgeCheck, ChevronDown, Megaphone, HelpCircle, Calendar,
  Award, X, Plus, Globe, GraduationCap, Lock, Bookmark, Info,
} from 'lucide-react'
import { createPost } from '../../services/postApi.js'
import Toast from '../Toast.jsx'
import Loader from '../Loader.jsx'

const POST_TYPES = [
  { key: 'general', label: 'General', icon: Megaphone, color: '#FFD93D' },
  { key: 'question', label: 'Question', icon: HelpCircle, color: '#93C5FD' },
  { key: 'event', label: 'Event', icon: Calendar, color: '#C4B5FD' },
  { key: 'achievement', label: 'Achievement', icon: Award, color: '#FBCFE8' },
]

const VISIBILITY_OPTIONS = [
  { key: 'public', label: 'Public', desc: 'Everyone', icon: Globe, color: '#86EFAC' },
  { key: 'college', label: 'College', desc: 'Only your college', icon: GraduationCap, color: '#93C5FD' },
  { key: 'private', label: 'Private', desc: 'Only me', icon: Lock, color: '#FDBA74' },
]

const MAX_IMAGES = 6
const TITLE_MAX = 100
const BODY_MAX = 1000

export default function CreatePostForm({ onBack, onPostCreated }) {
  const [postType, setPostType] = useState('general')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [images, setImages] = useState([]) // [{ file: File, preview: string }]
  const [visibility, setVisibility] = useState('public')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const fileInputRef = useRef(null)

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_IMAGES - images.length)
    const newItems = files.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setImages((prev) => [...prev, ...newItems].slice(0, MAX_IMAGES))
    e.target.value = '' // allow re-selecting the same file again later
  }

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const addTag = () => {
    const value = tagInput.trim()
    if (value && !tags.includes(value)) setTags((prev) => [...prev, value])
    setTagInput('')
  }

  const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag))

  const resetForm = () => {
    setTitle('')
    setBody('')
    images.forEach((img) => URL.revokeObjectURL(img.preview))
    setImages([])
    setVisibility('public')
    setPostType('general')
    setTags([])
    setTagInput('')
  }

  const handlePostNow = async () => {
    if (submitting) return // guards against duplicate submissions

    if (!body.trim()) {
      setToast({ message: 'Please write something before posting.', type: 'error' })
      return
    }

    setSubmitting(true)
    try {
      // V1 backend only supports general posts right now, so this is sent as a
      // fixed value regardless of which Post Type pill is selected in the UI.
      // Swap to `postType.toUpperCase()` once your schema supports the other types.
      const result = await createPost({
        title,
        description: body,
        postType: 'GENERAL',
        // Adjust this if your Mongoose schema expects a different casing/value
        // for visibility (e.g. 'PUBLIC' instead of 'public').
        visibility,
        media: images.map((img) => img.file),
      })

      setToast({ message: 'Post created!', type: 'success' })
      resetForm()

      onPostCreated?.(result?.post ?? result)
      onBack?.()
    } catch (err) {
      setToast({ message: err.message || 'Failed to create post. Try again.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-3 font-display font-semibold text-sm flex items-center gap-1.5 bg-white border-[2.5px] border-ink px-3 py-1.5 rounded-full shadow-hard-sm"
      >
        <ArrowLeft size={15} /> Back to Feed
      </button>

      <div className="bg-white border-[3px] border-ink rounded-2xl shadow-hard-sm p-5">
        <div className="flex items-start justify-between mb-1">
          <h2 className="font-display font-bold text-xl flex items-center gap-1.5">
            Create a Post <span className="text-base">📝</span>
          </h2>
          <Send size={18} className="text-ink/30 rotate-45 mt-1" />
        </div>
        <p className="text-xs text-ink/50 mb-5">Share your thoughts, updates, or moments with your campus!</p>


        {/* Post type */}
        <p className="text-xs font-display font-semibold mb-2">Post Type</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {POST_TYPES.map(({ key, label, icon: Icon, color }) => {
            const active = postType === key
            return (
              <button
                key={key}
                onClick={() => setPostType(key)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-display font-semibold transition ${
                  active ? 'border-2 border-ink shadow-hard-sm' : 'border-2 border-ink/10 text-ink/60'
                }`}
                style={{ backgroundColor: active ? color : `${color}40` }}
              >
                <Icon size={14} /> {label}
              </button>
            )
          })}
        </div>

        {/* Title */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-display font-semibold">Title <span className="text-ink/40 font-normal">(Optional)</span></label>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
            placeholder="Add a catchy title..."
            className="w-full px-4 py-2.5 rounded-xl border-2 border-ink/15 focus:border-ink outline-none text-sm transition"
          />
          <p className="text-right text-[10px] text-ink/40 mt-1">{title.length}/{TITLE_MAX}</p>
        </div>

        {/* Body */}
        <div className="mb-4">
          <label className="text-xs font-display font-semibold mb-1.5 block">
            What's on your mind? <span className="text-[#EF4444]">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, BODY_MAX))}
            placeholder="Write your post here..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-ink/15 focus:border-ink outline-none text-sm transition resize-none"
          />
          <p className="text-right text-[10px] text-ink/40 mt-1">{body.length}/{BODY_MAX}</p>
        </div>

        {/* Media */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-display font-semibold">Add Media <span className="text-ink/40 font-normal">(Images)</span></label>
            <span className="text-[10px] text-ink/40">Max {MAX_IMAGES} images</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border-2 border-ink/10">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-white border border-ink rounded-full flex items-center justify-center"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-ink/25 flex flex-col items-center justify-center gap-1 text-ink/40 hover:border-ink/50 transition"
              >
                <Plus size={16} />
                <span className="text-[9px] font-medium">Add More</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAddImages} />
          </div>
          <p className="text-[10px] text-ink/40 mt-2">You can add up to {MAX_IMAGES} images</p>
        </div>

        {/* Visibility */}
        <div className="mb-4">
          <label className="text-xs font-display font-semibold mb-2 flex items-center gap-1">
            Who can see this? <Info size={11} className="text-ink/30" />
          </label>
          <div className="grid grid-cols-3 gap-2">
            {VISIBILITY_OPTIONS.map(({ key, label, desc, icon: Icon, color }) => {
              const active = visibility === key
              return (
                <button
                  key={key}
                  onClick={() => setVisibility(key)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-center transition ${
                    active ? 'border-2 border-ink shadow-hard-sm' : 'border-2 border-ink/10'
                  }`}
                  style={{ backgroundColor: active ? `${color}55` : `${color}20` }}
                >
                  <Icon size={15} />
                  <span className="text-xs font-display font-semibold">{label}</span>
                  <span className="text-[9px] text-ink/50">{desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-5">
          <label className="text-xs font-display font-semibold mb-1.5 block">Add Tags <span className="text-ink/40 font-normal">(Optional)</span></label>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="e.g. placements, coding, hackathon"
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-ink/15 focus:border-ink outline-none text-sm transition"
            />
            <button onClick={addTag} className="w-10 h-10 bg-white border-2 border-ink rounded-xl flex items-center justify-center shrink-0">
              <Plus size={16} />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <span key={tag} className="bg-[#F3EFFC] border border-ink/15 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  #{tag}
                  <button onClick={() => removeTag(tag)}><X size={11} className="text-ink/40" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-white border-2 border-ink rounded-xl py-2.5 text-sm font-display font-semibold shadow-hard-sm">
            <Bookmark size={15} /> Save Draft
          </button>
          <button
            onClick={handlePostNow}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#EC4899] text-white border-2 border-ink rounded-xl py-2.5 text-sm font-display font-semibold shadow-hard-sm disabled:opacity-70"
          >
            {submitting ? <Loader size={16} color="white" /> : <>Post Now <Send size={15} /></>}
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}