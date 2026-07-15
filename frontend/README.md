# CampusConnect UI

Plain JavaScript React + Tailwind CSS (no TypeScript). Built with Vite.
Gen-Z / neobrutalist visual style — thick black borders, bold offset shadows,
bright colors, cartoon avatar stickers.

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Structure

```
src/
  main.jsx              entry point
  App.jsx               routes: / (Home), /login, /signup
  index.css             tailwind directives + wiggle/float/fadeIn animations
  components/
    Loader.jsx           small spinner, drop into any button
    Toast.jsx             popup message, auto-hides after 3s
  pages/
    Home.jsx              hero with cartoon avatar stickers, about, vision, contact
    Login.jsx              email + password + forgot password
    Signup.jsx              username/email -> OTP verification (2-step)
```

## Using Loader

```jsx
<button disabled={loading}>
  {loading ? <Loader size={18} color="#16151A" /> : 'Submit'}
</button>
```

## Using Toast

```jsx
const [toast, setToast] = useState(null)

setToast({ message: 'Something went wrong.', type: 'error' }) // 'success' | 'error' | 'info'

{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
```

## Theme colors (tailwind.config.js)

| Token | Hex | Use |
|---|---|---|
| `sunny` | #FFD93D | Send OTP button, badges |
| `bubblegum` | #FF6B9D | Signup CTA, verify button, error toast |
| `sky` | #4EA8DE | Login button/links, info toast |
| `lime` | #B8E62D | Success toast, vision cards |
| `cream` | #FFFDF7 | Page background |
| `ink` | #16151A | Borders, text, hard shadows |

Fonts: **Fredoka** (rounded, playful, `font-display`) + **Poppins** (`font-body`), loaded via Google Fonts in `index.html`.

Signature interaction: buttons have a thick border + hard offset shadow that
"presses down" (shadow disappears, button shifts) on click — this is the
neobrutalist look a lot of youth-facing apps use. Avatar stickers in the hero
use the DiceBear "adventurer" cartoon avatar API and wiggle on hover.

## Notes

- The floating avatar stickers use `https://api.dicebear.com/7.x/adventurer/svg?seed=...` — free, no API key, swap the seed names for anything.
- The API calls in Login/Signup are stubbed with `setTimeout` — swap for your real `fetch`/axios calls to your Express backend.
- Email input placeholders assume a college domain like `you@college.edu.in` — wire up your domain validation regex server-side.
