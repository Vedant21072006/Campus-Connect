
import { useNavigate } from 'react-router-dom'
import {
  Rocket,
  Users,
  Sparkles,
  PartyPopper,
  Flame,
  Mail,
  MapPin,
  Star,
  Zap,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react'

const avatarSeeds = ['Milo', 'Zara', 'Kabir', 'Anaya', 'Leo', 'Riya']

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="font-body text-ink bg-cream">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-cream border-b-[3px] border-ink">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <img
              src="/images/logo-1.svg"
              alt="CampusConnect"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="font-display font-semibold text-sm px-4 py-2 rounded-xl border-[3px] border-ink bg-sky shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Log in
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="font-display font-semibold text-sm px-4 py-2 rounded-xl border-[3px] border-ink bg-bubblegum shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-24 left-10 w-24 h-24 bg-lime rounded-full border-[3px] border-ink hidden md:block" />
        <div className="absolute bottom-10 right-16 w-16 h-16 bg-sunny rotate-12 border-[3px] border-ink hidden md:block" />

        <Star
          className="absolute top-40 right-1/3 text-bubblegum hidden md:block"
          size={28}
          fill="#FF6B9D"
        />

        <Zap
          className="absolute bottom-32 left-1/4 text-sky hidden md:block"
          size={26}
          fill="#4EA8DE"
        />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative">
          <div>
            <span className="inline-flex items-center gap-2 bg-sunny border-[3px] border-ink text-ink text-xs font-display font-semibold px-3 py-1.5 rounded-full mb-6 -rotate-2 shadow-hard-sm">
              <PartyPopper size={14} />
              Built for campus life
            </span>

            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-5">
              Your campus.
              <br />
              But way{' '}
              <span className="bg-bubblegum px-2 border-[3px] border-ink rounded-xl inline-block rotate-1">
                more fun.
              </span>{' '}
              🎉
            </h1>

            <p className="text-ink/70 text-base mb-8 max-w-md">
              Meet people from your college, share what's happening, and stay
              connected with your campus community — all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="font-display font-semibold bg-bubblegum px-6 py-3 rounded-2xl border-[3px] border-ink shadow-hard hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
              >
                Join the community 🚀
              </button>

              <button
                onClick={() => navigate('/login')}
                className="font-display font-semibold bg-white px-6 py-3 rounded-2xl border-[3px] border-ink shadow-hard hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
              >
                Log in
              </button>
            </div>

            <div className="flex items-center gap-2 mt-6 text-sm text-ink/70">
              <ShieldCheck size={18} className="text-green-700" />
              <span>College-email verification</span>
            </div>
          </div>

          {/* Decorative avatar cluster */}
          <div className="relative h-96 hidden md:block">
            <div className="absolute inset-0 bg-sky/30 rounded-[3rem] border-[3px] border-ink" />

            {avatarSeeds.map((seed, i) => {
              const positions = [
                'top-6 left-10',
                'top-2 right-14',
                'top-32 left-1/2 -translate-x-1/2',
                'bottom-24 left-4',
                'bottom-6 right-8',
                'bottom-16 left-1/2 -translate-x-1/3',
              ]

              return (
                <img
                  key={seed}
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=ffd93d,ff6b9d,4ea8de,b8e62d`}
                  alt=""
                  aria-hidden="true"
                  className={`sticker-wiggle float absolute ${positions[i]} w-20 h-20 rounded-full border-[3px] border-ink bg-cream shadow-hard-sm`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              )
            })}

            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border-[3px] border-ink px-4 py-1.5 rounded-full text-xs font-display font-semibold shadow-hard-sm flex items-center gap-1.5 whitespace-nowrap">
              <Flame size={14} className="text-bubblegum" />
              A growing campus community
            </span>
          </div>
        </div>
      </section>

      {/* About us */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-display font-semibold text-sm bg-lime border-[3px] border-ink px-3 py-1 rounded-full inline-block -rotate-1">
            About us
          </span>

          <h2 className="font-display text-3xl font-semibold mt-5 mb-5">
            Why we built this
          </h2>

          <p className="text-ink/70 text-base leading-relaxed max-w-2xl mx-auto">
            Campus life is spread across chats, social platforms, and college
            groups. CampusConnect aims to bring students together in one
            college-focused space to share posts, discover people, and build
            meaningful connections.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="font-display font-semibold text-sm bg-sky border-[3px] border-ink px-3 py-1 rounded-full inline-block rotate-1">
              Our vision
            </span>

            <h2 className="font-display text-3xl font-semibold mt-5">
              A more connected campus
            </h2>

            <p className="text-ink/70 text-sm mt-4 max-w-xl mx-auto">
              We're building the foundations first, with more ways to connect
              and discover campus life planned for the future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                color: 'bg-sunny',
                rotate: '-rotate-2',
                title: 'Find your people',
                text: 'Create your profile, discover fellow students, and build connections within your campus community.',
              },
              {
                icon: MessageCircle,
                color: 'bg-bubblegum',
                rotate: 'rotate-1',
                title: 'Share and connect',
                text: 'Share posts, interact with your community, and chat with your connections.',
              },
              {
                icon: Sparkles,
                color: 'bg-lime',
                rotate: '-rotate-1',
                title: 'More coming soon',
                text: 'Dedicated connection discovery, personalized suggestions, clubs, and campus events are part of the future vision.',
              },
            ].map(({ icon: Icon, color, rotate, title, text }) => (
              <div
                key={title}
                className={`${color} border-[3px] border-ink rounded-2xl p-6 shadow-hard ${rotate} hover:rotate-0 transition-transform`}
              >
                <div className="w-12 h-12 bg-white rounded-xl border-[3px] border-ink flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>

                <h3 className="font-display font-semibold text-lg mb-2">
                  {title}
                </h3>

                <p className="text-ink/70 text-sm leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact us */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-display font-semibold text-sm bg-white border-[3px] border-ink px-3 py-1 rounded-full inline-block -rotate-1">
            Contact us
          </span>

          <h2 className="font-display text-3xl font-semibold mt-5 mb-10">
            Say hey 👋
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 max-w-md mx-auto">
            <a
              href="mailto:vedant8052006@gmail.com"
              className="bg-sunny border-[3px] border-ink rounded-2xl p-6 shadow-hard-sm flex flex-col items-center gap-2 -rotate-1 hover:rotate-0 transition-transform"
            >
              <Mail size={20} />
              <p className="text-xs font-medium break-all">
                vedant8052006@gmail.com
              </p>
            </a>

            <div className="bg-bubblegum border-[3px] border-ink rounded-2xl p-6 shadow-hard-sm flex flex-col items-center gap-2 rotate-1">
              <MapPin size={20} />
              <p className="text-xs font-medium">
                Pune, Maharashtra
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-ink text-center text-xs py-6 px-4 font-medium">
        © {new Date().getFullYear()} CampusConnect — made for students, by students. 🎓
      </footer>
    </div>
  )
}
