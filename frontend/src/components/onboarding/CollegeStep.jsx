import { useState, useRef, useEffect } from 'react'
import { GraduationCap, Search } from 'lucide-react'
import Loader from '../Loader.jsx'

// Free, no-key public API — swap this for your own backend endpoint later
// (e.g. `${apiUrl}/colleges/search?q=...`) if you want a curated Indian dataset instead.
const COLLEGE_SEARCH_URL = 'https://universities.hipolabs.com/search?country=India&name='

export default function CollegeStep({ data, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)

  // Debounced live search — waits 350ms after typing stops before hitting the API
  useEffect(() => {
    if (!data.collegeName || data.collegeName.length < 2) {
      setResults([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`${COLLEGE_SEARCH_URL}${encodeURIComponent(data.collegeName)}`)
        const json = await res.json()
        setResults(json.slice(0, 8)) // cap the dropdown length
      } catch (err) {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [data.collegeName])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectCollege = (name) => {
    onChange('collegeName', name)
    setShowDropdown(false)
  }

  return (
    <div className="space-y-4">
      <div ref={wrapperRef} className="relative">
        <label className="text-xs font-display font-semibold mb-1.5 block">College name</label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
          <input
            value={data.collegeName}
            onChange={(e) => {
              onChange('collegeName', e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Start typing your college..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
          />
          {loading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <Loader size={16} color="#16151A" />
            </div>
          )}
        </div>

        {showDropdown && data.collegeName.length >= 2 && (
          <div className="absolute z-20 mt-2 w-full bg-white border-[3px] border-ink rounded-xl shadow-hard max-h-52 overflow-y-auto">
            {results.length > 0 ? (
              results.map((college) => (
                <button
                  key={college.name}
                  type="button"
                  onClick={() => selectCollege(college.name)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-sunny/30 flex items-center gap-2 border-b border-ink/10 last:border-b-0"
                >
                  <GraduationCap size={16} className="text-ink/40 shrink-0" />
                  {college.name}
                </button>
              ))
            ) : !loading ? (
              <p className="px-4 py-3 text-xs text-ink/50">
                No matches — you can still type your college name manually.
              </p>
            ) : null}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-display font-semibold mb-1.5 block">Department</label>
          <input
            value={data.department}
            onChange={(e) => onChange('department', e.target.value)}
            placeholder="Computer Engineering"
            className="w-full px-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
          />
        </div>
        <div>
          <label className="text-xs font-display font-semibold mb-1.5 block">Branch</label>
          <input
            value={data.branch}
            onChange={(e) => onChange('branch', e.target.value)}
            placeholder="CSE"
            className="w-full px-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-display font-semibold mb-1.5 block">Course</label>
          <input
            value={data.course}
            onChange={(e) => onChange('course', e.target.value)}
            placeholder="B.Tech"
            className="w-full px-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
          />
        </div>
        <div>
          <label className="text-xs font-display font-semibold mb-1.5 block">Year</label>
          <select
            value={data.year}
            onChange={(e) => onChange('year', e.target.value)}
            className="w-full px-3 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition bg-white"
          >
            <option value="">--</option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-display font-semibold mb-1.5 block">Section</label>
          <input
            value={data.section}
            onChange={(e) => onChange('section', e.target.value)}
            placeholder="A"
            className="w-full px-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
          />
        </div>
      </div>
    </div>
  )
}