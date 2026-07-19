import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Rocket, ArrowLeft } from 'lucide-react'
import Loader from '../components/Loader.jsx'
import Toast from '../components/Toast.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const apiUrl = import.meta.env.VITE_API_URL
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setToast({ message: 'Fill in both fields first!', type: 'error' })
      return
    }
    setLoading(true)
    try {
      let logindetails={email,password}
      let api = await fetch(`${apiUrl}/auth/login`,{
        method:'POST',
        credentials:'include',
        body:JSON.stringify(logindetails),
        headers:{
          'Content-Type':'application/json'
        }
       
        
        
      })
      api =await api.json()
      console.log(api);
      
      if(!api.success){
        setToast({message:api.message,type:'error'})
        return
      }

       
      setToast({ message: `Welcome ${api.user.name} 🎉`, type: 'success' })
    } catch (err) {
      setToast({ message: 'Wrong email or password.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky/30 flex items-center justify-center px-6 py-12 relative overflow-hidden font-body">
      <div className="absolute top-16 left-14 w-16 h-16 bg-sunny rounded-full border-[3px] border-ink hidden md:block" />
      <div className="absolute bottom-20 right-20 w-20 h-20 bg-lime rotate-12 border-[3px] border-ink hidden md:block" />

      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 font-display font-semibold text-sm flex items-center gap-1.5 bg-white border-[3px] border-ink px-3 py-1.5 rounded-full shadow-hard-sm z-10"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="relative bg-white rounded-3xl border-[3px] border-ink shadow-hard-lg w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-bubblegum rounded-xl border-[3px] border-ink flex items-center justify-center">
            <Rocket size={18} />
          </div>
          <span className="font-display font-semibold text-lg">CampusConnect</span>
        </div>

        <h1 className="font-display text-2xl font-semibold mb-1">Welcome back! 👋</h1>
        <p className="text-ink/60 text-sm mb-8">Log in and see what you missed.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-display font-semibold mb-1.5 block">College email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu.in"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-display font-semibold mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
              />
            </div>
            <div className="text-right mt-2">
              <button type="button" className="text-xs font-display font-semibold text-sky-dark hover:underline">
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bubblegum font-display font-semibold py-3 rounded-2xl border-[3px] border-ink shadow-hard hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader size={18} color="#16151A" /> : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          New here?{' '}
          <button onClick={() => navigate('/signup')} className="font-display font-semibold text-sky-dark hover:underline">
            Create account
          </button>
        </p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
