import { useEffect, useRef, useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;
const DEBOUNCE_MS = 700;

// NOTE: the searchUsers controller wasn't shared, so the response key
// is a guess — this checks a few common shapes. If your API actually
// returns something else, adjust the `extractUsers` line below.
async function searchUsers(q) {
  const res = await fetch(
    `${apiUrl}/search/users?q=${encodeURIComponent(q)}`,
    { method: "GET", credentials: "include" }
  );
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data?.message || "Search failed");
  return data;
}

function extractUsers(data) {
  return data.users || data.results || data.data || [];
}

export default function HomeSearchBar() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // =====================================================
  // DEBOUNCED SEARCH
  // =====================================================

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setSearching(false);
      return;
    }

    // Loader shows immediately — the request itself only fires
    // after DEBOUNCE_MS of no typing.
    setSearching(true);

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const data = await searchUsers(trimmed);
        if (!cancelled) setResults(extractUsers(data));
      } catch (err) {
        console.error("Search error:", err);
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // =====================================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  };

  const handleSelectUser = (userId) => {
    setShowDropdown(false);
    navigate(`/profile/${userId}`);
  };

  const dropdownOpen = showDropdown && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <style>{`
        @keyframes csSearchGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes csFloat {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes csFloatDelay {
          0%, 100% { transform: translateY(-4px) rotate(3deg); }
          50% { transform: translateY(3px) rotate(-3deg); }
        }
      `}</style>

      {/* SEARCH INPUT — animated rainbow border pill */}
      <div
        className="
          p-[3px] rounded-full
          bg-[length:200%_200%]
          bg-gradient-to-r from-[#7C3AED] via-[#EC4899] via-[#F97316] to-[#7C3AED]
          [animation:csSearchGradient_4s_ease_infinite]
          shadow-[4px_4px_0px_#000]
          transition-transform
          focus-within:scale-[1.015]
        "
      >
        <div className="flex items-center gap-2.5 bg-[#FFFDF8] border-2 border-black rounded-full px-4 py-3">
          <div className="w-7 h-7 shrink-0 rounded-full bg-[#FFD93D] border-2 border-black flex items-center justify-center">
            <Search size={13} className="text-black" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Find your campus fam..."
            className="
              flex-1 min-w-0
              text-sm font-semibold
              bg-transparent
              placeholder:text-[#9CA3AF] placeholder:font-medium
              focus:outline-none
            "
          />

          {searching && (
            <Loader2 size={18} className="animate-spin text-[#EC4899] shrink-0" />
          )}

          {!searching && query && (
            <button
              type="button"
              onClick={handleClear}
              className="
                shrink-0 w-6 h-6 flex items-center justify-center
                rounded-full border-2 border-black bg-white
                text-black hover:bg-[#FEE2E2] transition
              "
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* EMPTY STATE — shown when there's nothing typed yet */}
      {!query.trim() && (
        <div className="flex flex-col items-center text-center py-8 px-4">
          <svg
            viewBox="0 0 160 120"
            className="w-40 h-32 mb-3"
            style={{ animation: "csFloat 3.5s ease-in-out infinite" }}
          >
            {/* face */}
            <circle cx="70" cy="55" r="34" fill="#FFD93D" stroke="#000" strokeWidth="3" />
            {/* sunglasses */}
            <rect x="45" y="48" width="22" height="14" rx="6" fill="#111" stroke="#000" strokeWidth="2" />
            <rect x="75" y="48" width="22" height="14" rx="6" fill="#111" stroke="#000" strokeWidth="2" />
            <line x1="67" y1="54" x2="75" y2="54" stroke="#000" strokeWidth="2" />
            {/* smile */}
            <path d="M58 72 Q70 82 82 72" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* magnifying glass */}
            <g transform="rotate(25 108 88)">
              <circle cx="100" cy="80" r="16" fill="#86EFAC" stroke="#000" strokeWidth="3" />
              <line x1="111" y1="91" x2="126" y2="106" stroke="#000" strokeWidth="6" strokeLinecap="round" />
            </g>
            {/* floating friend bubbles */}
            <g style={{ animation: "csFloatDelay 3s ease-in-out infinite" }}>
              <circle cx="20" cy="30" r="10" fill="#EC4899" stroke="#000" strokeWidth="2.5" />
              <text x="20" y="34" fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle">A</text>
            </g>
            <g style={{ animation: "csFloat 4s ease-in-out infinite" }}>
              <circle cx="135" cy="35" r="9" fill="#7C3AED" stroke="#000" strokeWidth="2.5" />
              <text x="135" y="39" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">B</text>
            </g>
            <g style={{ animation: "csFloatDelay 3.2s ease-in-out infinite" }}>
              <circle cx="18" cy="90" r="8" fill="#F97316" stroke="#000" strokeWidth="2.5" />
              <text x="18" y="94" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">C</text>
            </g>
          </svg>

          <p className="font-extrabold text-sm">
            Find your campus fam 🎓
          </p>
          <p className="text-xs text-[#6B7280] mt-1 max-w-[240px]">
            Search for friends, classmates, or collaborators — your people are just a keystroke away.
          </p>
        </div>
      )}

      {/* RESULTS DROPDOWN */}
      {dropdownOpen && (
        <div
          className="
            absolute left-0 right-0 mt-2 z-40
            bg-white border-2 border-black rounded-2xl
            shadow-[4px_4px_0px_#000]
            max-h-80 overflow-y-auto
          "
        >
          {searching && results.length === 0 && (
            <p className="text-xs text-[#6B7280] text-center py-6">
              Searching...
            </p>
          )}

          {!searching && results.length === 0 && (
            <p className="text-xs text-[#6B7280] text-center py-6">
              No users found.
            </p>
          )}

          {results.map((user) => {
            const fullName = [user.firstName, user.lastName]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user._id)}
                className="
                  flex items-center gap-3 px-4 py-2.5
                  cursor-pointer
                  hover:bg-[#F3F4F6]
                  border-b-2 border-black last:border-b-0
                  transition-colors
                "
              >
                <div className="w-9 h-9 shrink-0 rounded-full bg-[#FACC15] border-2 border-black flex items-center justify-center text-xs font-bold overflow-hidden">
                  {user.profilePicture?.url ? (
                    <img
                      src={user.profilePicture.url}
                      alt={fullName || user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (user.firstName?.[0] || user.username?.[0] || "U").toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">
                    {fullName || user.username}
                  </p>
                  <p className="text-xs text-[#6B7280] truncate">
                    @{user.username}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}