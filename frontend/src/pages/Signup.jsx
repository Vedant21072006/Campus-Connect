import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ShieldCheck, Rocket, ArrowLeft } from 'lucide-react'
import Loader from '../components/Loader.jsx'
import Toast from '../components/Toast.jsx'
const apiUrl = import.meta.env.VITE_API_URL
export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState('details') // 'details' | 'otp'

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [userId,setUserId]= useState('')

  const [loadingSend, setLoadingSend] = useState(false)
  const [loadingVerify, setLoadingVerify] = useState(false)
  const [loadingResend, setLoadingResend] = useState(false)
  const [toast, setToast] = useState(null)

  {/* Backend events */ }
  const sendOtp = async (e) => {
    e.preventDefault()
  setLoadingSend(true)
  console.log(apiUrl);
  
    try {
      if (!username || !email || !password) {
        setToast({ message: 'Fill in all fields first!', type: 'error' })
        return
      }
      const registerDetails  = { name:username, email, password }

      
        
        let api = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(registerDetails),
        headers: {
  'Content-Type': 'application/json'
}
      })
      api = await api.json()
    console.log(api);
    
      if (!api.success && api.status == 'VERIFIED_USER') {
        setToast({ message: 'Account already exists try loggin-in' })
        return
      }
    
     setUserId(api.userId)
      setToast({ message: 'OTP sent! Check your inbox 📬', type: 'success' })
      setStep('otp')


        }
    catch (error) {
     setToast({ message: "Couldn't send OTP, try again.", type: 'error' })
      
    }
    finally{
      setLoadingSend(false)
    }
  }



  const handleResendOtp = async () => {
    setLoadingResend(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setToast({ message: 'New OTP on its way!', type: 'success' })
    } catch (err) {
      setToast({ message: "Couldn't resend OTP.", type: 'error' })
    } finally {
      setLoadingResend(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp) {
      setToast({ message: 'Enter the OTP first!', type: 'error' })
      return
    }
    setLoadingVerify(true)
    try {
      let api = await fetch(`${apiUrl}/auth/verify-otp`,{
        method:'POST',
        credentials:'include',
          body:JSON.stringify({userId,otp}),
          headers:{
            'Content-Type':'application/json'
          }
      })
      api =await api.json()
      if(!api.success){
        setToast({message:api.message,type:'error'})
        return
      }
      setToast({ message: "Verified! Welcome aboard 🎉", type: 'success' })
    } catch (err) {
      setToast({ message: 'Invalid or expired OTP.', type: 'error' })
    } finally {
      setLoadingVerify(false)
    }
  }

  return (
    <div className="min-h-screen bg-lime/30 flex items-center justify-center px-6 py-12 relative overflow-hidden font-body">
      <div className="absolute top-16 right-14 w-16 h-16 bg-bubblegum rounded-full border-[3px] border-ink hidden md:block" />
      <div className="absolute bottom-20 left-20 w-20 h-20 bg-sky rotate-12 border-[3px] border-ink hidden md:block" />

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

        {step === 'details' ? (
          <>
            <h1 className="font-display text-2xl font-semibold mb-1">Let's get you in 🚀</h1>
            <p className="text-ink/60 text-sm mb-8">Sign up with your college email.</p>

            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={18} />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm transition"
                  />
                </div>
              </div>

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
              </div>

              <button
                type="submit"
                disabled={loadingSend}
                className="w-full bg-sunny font-display font-semibold py-3 rounded-2xl border-[3px] border-ink shadow-hard hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loadingSend ? <Loader size={18} color="#16151A" /> : 'Send OTP'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold mb-1">Check your inbox 📬</h1>
            <p className="text-ink/60 text-sm mb-8">
              We sent a 6-digit code to <span className="font-semibold text-ink">{email}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-xs font-display font-semibold mb-1.5 block">Enter OTP</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-[3px] border-ink focus:bg-sunny/20 outline-none text-sm tracking-[0.3em] font-semibold transition"
                  />
                </div>
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loadingResend}
                    className="text-xs font-display font-semibold text-sky-dark hover:underline inline-flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {loadingResend ? <Loader size={12} color="#2E86C1" /> : null}
                    Resend OTP
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingVerify}
                className="w-full bg-bubblegum font-display font-semibold py-3 rounded-2xl border-[3px] border-ink shadow-hard hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loadingVerify ? <Loader size={18} color="#16151A" /> : 'Verify OTP & Log in'}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-ink/60 mt-6">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="font-display font-semibold text-sky-dark hover:underline">
            Log in
          </button>
        </p>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}