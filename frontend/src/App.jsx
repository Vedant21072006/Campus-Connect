import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Profile from './pages/Profile.jsx'
import Feed from './pages/Feed.jsx'
import Notifications from './pages/Notifications.jsx'
import SocketProvider from './components/context/SocketProvider.jsx'
import {PresenceProvider} from './components/context/PresenceContext.jsX'
import ComingSoon from './components/comingsoon.jsx'
export default function App() {
  return (
    <BrowserRouter>
     <SocketProvider>
       <PresenceProvider>
         <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path='/feed'  element={<Feed/>} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/connect" element={<ComingSoon feature="connect" />} />
        <Route path="/suggestions" element={<ComingSoon feature="suggestions" />} />
      </Routes>
      </PresenceProvider>
     </SocketProvider>
    </BrowserRouter>
  )
}