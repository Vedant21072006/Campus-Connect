import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Flag,
  Link,
  EyeOff,
  UserMinus,
} from "lucide-react";

export default function PostCard({ post }) {
  const {
    authorSnapshot,
    metadata,
    postType,
    stats,
  } = post;

  const username = authorSnapshot?.username || "Unknown User";

  const college = authorSnapshot?.college;

  const meta = [
    college?.year ? `${college.year} year` : null,
    college?.course || null,
    college?.branch || null,
  ]
    .filter(Boolean)
    .join(" • ");

  const title = metadata?.title || "";
  const description = metadata?.description || "";
  const media = metadata?.media || [];

  const likes = stats?.likes || 0;
  const comments = stats?.comments || 0;
  const shares = stats?.shares || 0;

  const [isFollowing, setIsFollowing] = useState(
    post?.isFollowing || false
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const scrollerRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index) => {
    const el = scrollerRef.current;

    if (!el) return;

    const clamped = Math.max(
      0,
      Math.min(index, media.length - 1)
    );

    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: "smooth",
    });

    setActiveIndex(clamped);
  };

  const handleScroll = () => {
    const el = scrollerRef.current;

    if (!el || el.clientWidth === 0) return;

    const index = Math.round(
      el.scrollLeft / el.clientWidth
    );

    setActiveIndex(index);
  };

  const handleFollow = () => {
    // Connect follow API here later
    setIsFollowing((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = () => {
      setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener(
        "click",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleOutsideClick
      );
    };
  }, [menuOpen]);

  return (
    <div className="bg-white border-[2.5px] border-black rounded-2xl shadow-hard-sm p-4">

      {/* ================= AUTHOR ================= */}

      <div className="flex items-start gap-3 mb-4">

        {/* Avatar */}
        <div className="w-10 h-10 shrink-0 rounded-full bg-[#FACC15] border-2 border-black flex items-center justify-center font-bold">
          {username?.[0]?.toUpperCase() || "U"}
        </div>

        {/* Author Details */}
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">
            {username}
          </p>

          <p className="text-xs text-[#6B7280] truncate">
            {meta || "CampusConnect"}
          </p>
        </div>

        {/* Follow */}
        <button
          onClick={handleFollow}
          className={`
            ml-auto
            shrink-0
            text-[11px]
            font-bold
            px-2.5
            py-1
            rounded-full
            border-2
            border-black
            transition-all
            ${
              isFollowing
                ? "bg-white text-black"
                : "bg-[#FFD93D] text-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            }
          `}
        >
          {isFollowing ? "Following" : "Follow +"}
        </button>

        {/* More */}
        <div
          className="relative shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
            className="text-[#6B7280] hover:text-black transition"
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-7 z-50 w-44 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] overflow-hidden">

              <button
                onClick={() => {
                  console.log("Report post");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-[#FEE2E2]"
              >
                <Flag size={14} />
                Report post
              </button>

              <button
                onClick={() => {
                  console.log("Not interested");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-[#F3F4F6]"
              >
                <EyeOff size={14} />
                Not interested
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    window.location.href
                  );

                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-[#F3F4F6]"
              >
                <Link size={14} />
                Copy link
              </button>

              {isFollowing && (
                <button
                  onClick={() => {
                    setIsFollowing(false);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-[#F3F4F6]"
                >
                  <UserMinus size={14} />
                  Unfollow
                </button>
              )}

              <button
                onClick={() => {
                  console.log("Hide post");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-[#F3F4F6]"
              >
                <EyeOff size={14} />
                Hide post
              </button>

            </div>
          )}
        </div>
      </div>

      {/* ================= POST TYPE ================= */}

      {postType && (
        <span className="inline-block mb-2 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E]">
          {postType}
        </span>
      )}

      {/* ================= TITLE ================= */}

      {title && (
        <p className="font-semibold text-sm mb-1">
          {title}
        </p>
      )}

      {/* ================= DESCRIPTION ================= */}

      {description && (
        <p className="text-sm text-[#6B7280] leading-relaxed mb-3">
          {description}
        </p>
      )}

      {/* ================================================= */}
      {/* SINGLE IMAGE                                      */}
      {/* ================================================= */}

      {media.length === 1 && (
        <div className="w-full rounded-xl border-2 border-black overflow-hidden bg-[#F3F4F6] mb-3">

          <div className="w-full max-h-[330px] flex items-center justify-center">

            <img
              src={media[0].url}
              alt="Post media"
              className="
                block
                max-w-full
                max-h-[330px]
                w-auto
                h-auto
                object-contain
              "
            />

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* MULTIPLE IMAGES                                   */}
      {/* ================================================= */}

      {media.length > 1 && (
        <div className="relative mb-3 group">

          <div
            ref={scrollerRef}
            onScroll={handleScroll}
            className="
              flex
              overflow-x-auto
              snap-x
              snap-mandatory
              scroll-smooth
              rounded-xl
              border-2
              border-black
              scrollbar-hide
              bg-[#F3F4F6]
            "
          >

            {media.map((item, index) => (
              <div
                key={item.publicId || index}
                className="
                  w-full
                  shrink-0
                  snap-center
                  flex
                  items-center
                  justify-center
                  min-h-[180px]
                  max-h-[330px]
                "
              >

                <img
                  src={item.url}
                  alt={`Post media ${index + 1}`}
                  className="
                    block
                    max-w-full
                    max-h-[330px]
                    w-auto
                    h-auto
                    object-contain
                  "
                />

              </div>
            ))}

          </div>

          {/* Previous */}

          {activeIndex > 0 && (
            <button
              onClick={() =>
                scrollToIndex(activeIndex - 1)
              }
              className="
                hidden
                sm:flex
                absolute
                left-2
                top-1/2
                -translate-y-1/2
                w-8
                h-8
                items-center
                justify-center
                rounded-full
                bg-white
                border-2
                border-black
                shadow-[2px_2px_0px_#000]
                opacity-0
                group-hover:opacity-100
                transition-opacity
              "
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Next */}

          {activeIndex < media.length - 1 && (
            <button
              onClick={() =>
                scrollToIndex(activeIndex + 1)
              }
              className="
                hidden
                sm:flex
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                w-8
                h-8
                items-center
                justify-center
                rounded-full
                bg-white
                border-2
                border-black
                shadow-[2px_2px_0px_#000]
                opacity-0
                group-hover:opacity-100
                transition-opacity
              "
            >
              <ChevronRight size={16} />
            </button>
          )}

          {/* Image Counter */}

          <span className="
            absolute
            top-2
            right-2
            bg-black/70
            text-white
            text-[10px]
            font-semibold
            px-2
            py-0.5
            rounded-full
          ">
            {activeIndex + 1}/{media.length}
          </span>

        </div>
      )}

      {/* ================= STATS ================= */}

      <div className="flex items-center gap-5 text-[#6B7280] text-xs">

        <button className="flex items-center gap-1.5 hover:text-[#EF4444] transition">
          <Heart
            size={16}
            className="text-[#EF4444]"
          />
          {likes}
        </button>

        <button className="flex items-center gap-1.5 hover:text-black transition">
          <MessageCircle size={16} />
          {comments}
        </button>

        {shares > 0 && (
          <button className="flex items-center gap-1.5 hover:text-black transition">
            <Share2 size={16} />
            {shares}
          </button>
        )}

        <button className="ml-auto text-[#9CA3AF] hover:text-black transition">
          <Bookmark size={16} />
        </button>

      </div>

    </div>
  );
}