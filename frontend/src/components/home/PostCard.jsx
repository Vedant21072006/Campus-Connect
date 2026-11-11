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

import { removeFriend, sendRequest } from "../../services/friendshipApi.js";
import { likePost } from "../../services/postApi.js";
import { useNavigate } from "react-router-dom";
import CommentBox from "./commentbox.jsx";

export default function PostCard({ post }) {
  const navigate = useNavigate()
  const {
    _id,
    authorSnapshot,
    metadata,
    hashtags,
    visibility,
    stats,
    author,
    isOwnPost,
  } = post;

  // =====================================================
  // AUTHOR DATA
  // =====================================================

  const username =
    authorSnapshot?.username || "Unknown User";

  const college = authorSnapshot?.college;

  const meta = [
    college?.year
      ? `${college.year} year`
      : null,
    college?.course || null,
    college?.branch || null,
  ]
    .filter(Boolean)
    .join(" • ");

  // =====================================================
  // POST DATA
  // =====================================================

  const title = metadata?.title || "";
  const description = metadata?.description || "";
  const media = metadata?.media || [];

  const comments = stats?.comments || 0;
  const shares = stats?.shares || 0;

  // =====================================================
  // FRIENDSHIP
  // =====================================================

  const [friendStatus, setFriendStatus] = useState(
    post?.friendStatus || "none"
  );

  // Keep local friendStatus in sync whenever the parent
  // passes down a fresh post object (e.g. after a refetch
  // triggered by accepting a request elsewhere).
  useEffect(() => {
    setFriendStatus(post?.friendStatus || "none");
  }, [post?.friendStatus]);

  // =====================================================
  // LIKE STATE
  // =====================================================

  const [isLiked, setIsLiked] = useState(
    post?.isLiked || false
  );

  const [likeCount, setLikeCount] = useState(
    post?.stats?.likes || 0
  );

  const [liking, setLiking] = useState(false);

  // =====================================================
  // MENU
  // =====================================================

  const [menuOpen, setMenuOpen] = useState(false);

  // =====================================================
  // IMAGE CAROUSEL
  // =====================================================

  const scrollerRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // =====================================================
  // COMMENT BOX
  // =====================================================
  const [showComments, setShowComments] = useState(false);

  // =====================================================
  // IMAGE SCROLL
  // =====================================================

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

  // =====================================================
  // SEND FRIEND REQUEST
  // =====================================================

  const handleFollow = async (recipientId) => {
    try {
      const data = await sendRequest(recipientId);

      if (data.success) {
        setFriendStatus("pending");
      } else {
        console.error("Follow failed:", data?.message);
      }
    } catch (error) {
      console.error(
        "Friend request error:",
        error
      );
    }
  };

  // =====================================================
  // UNFRIEND
  // =====================================================

  const handleUnfriend = async () => {
    try {
      const data = await removeFriend(author?._id);

      if (data?.success) {
        // Backend confirmed removal → update UI
        setFriendStatus("none");
      } else {
        // Backend responded but didn't succeed (e.g. friendship
        // not found) — log it instead of silently updating UI
        console.error("Unfriend failed:", data?.message);
      }
    } catch (error) {
      // Request threw (network error, 404, 500, etc.) — don't
      // touch friendStatus, since we don't know the real state
      console.error("Unfriend error:", error);
    } finally {
      setMenuOpen(false);
    }
  };

  // =====================================================
  // LIKE POST
  // =====================================================

  const handleLike = async () => {
    // Prevent multiple clicks while request is running
    if (liking) return;

    // Save previous state in case API fails
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // =================================================
    // OPTIMISTIC UI
    // =================================================

    setIsLiked(!previousLiked);

    setLikeCount(
      previousLiked
        ? previousCount - 1
        : previousCount + 1
    );

    try {
      setLiking(true);

      const data = await likePost(_id);

      // =================================================
      // USE BACKEND AS FINAL SOURCE OF TRUTH
      // =================================================

      if (data.success) {
        setIsLiked(data.isLiked);

        setLikeCount(data.likes);
      }
    } catch (error) {
      console.error(
        "Like error:",
        error
      );

      // =================================================
      // ROLLBACK UI IF API FAILS
      // =================================================

      setIsLiked(previousLiked);

      setLikeCount(previousCount);
    } finally {
      setLiking(false);
    }
  };

  // =====================================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // =====================================================

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

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative bg-white border-[2.5px] border-black rounded-2xl shadow-hard-sm p-4">

      {/* VISIBILITY BADGE - TOP RIGHT */}
      <span
        className={`absolute top-4 right-14 z-10 text-[10px] font-semibold px-2 py-1 rounded-full border ${
          visibility === "public"
            ? "bg-green-100 text-green-800 border-green-300"
            : visibility === "campus"
            ? "bg-blue-100 text-blue-800 border-blue-300"
            : visibility === "private"
            ? "bg-gray-100 text-gray-700 border-gray-300"
            : "bg-yellow-100 text-yellow-800 border-yellow-300"
        }`}
      >
        {visibility === "public"
          ? "🌐 Public"
          : visibility === "campus"
          ? "🎓 Campus"
          : visibility === "private"
          ? "🔒 Private"
          : "👥 Friends"}
      </span>

      {/* ================================================= */}
      {/* AUTHOR                                           */}
      {/* ================================================= */}

      <div className="flex items-start gap-3 mb-4">

        {/* AVATAR */}

        <div className="w-10 h-10 shrink-0 rounded-full bg-[#FACC15] border-2 border-black flex items-center justify-center font-bold overflow-hidden">

          {author?.profilePicture?.url ? (
            <img
              src={author.profilePicture.url}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            username?.[0]?.toUpperCase() || "U"
          )}

        </div>

        {/* AUTHOR DETAILS */}

        <div className="min-w-0">
          <p className="font-bold text-sm truncate">
            {username}
          </p>

          <p className="text-xs text-[#6B7280] truncate">
            {meta || "CampusConnect"}
          </p>
        </div>

        {/* ================================================= */}
        {/* FRIENDSHIP BUTTON                                 */}
        {/* ================================================= */}

        <div className="ml-auto shrink-0 w-[82px]">

          {/* FOLLOW */}

          {!isOwnPost &&
            friendStatus === "none" && (
              <button
                onClick={() =>
                  handleFollow(author?._id)
                }
                className="
                  w-full
                  text-[11px]
                  font-bold
                  px-2.5
                  py-1
                  rounded-full
                  border-2
                  border-black
                  bg-[#FFD93D]
                  text-black
                  shadow-[2px_2px_0px_#000]
                  hover:translate-x-[1px]
                  hover:translate-y-[1px]
                  hover:shadow-none
                  transition-all
                "
              >
                Follow +
              </button>
            )}

          {/* PENDING */}

          {!isOwnPost &&
            friendStatus === "pending" && (
              <span
                className="
                  block
                  w-full
                  text-center
                  text-[11px]
                  font-bold
                  px-2.5
                  py-1
                  rounded-full
                  border-2
                  border-black
                  bg-white
                  text-black
                "
              >
                Pending
              </span>
            )}

          {/* FRIENDS */}

          {!isOwnPost &&
            friendStatus === "accepted" && (
              <span
                className="
                  block
                  w-full
                  text-center
                  text-[11px]
                  font-bold
                  px-2.5
                  py-1
                  rounded-full
                  border-2
                  border-black
                  bg-[#86EFAC]
                  text-black
                "
              >
                Friends ✓
              </span>
            )}

          {/* OWN POST */}

          {isOwnPost && (
            <div className="w-full h-[28px]" />
          )}

        </div>

        {/* ================================================= */}
        {/* MORE MENU                                         */}
        {/* ================================================= */}

        <div
          className="relative shrink-0"
          onClick={(e) =>
            e.stopPropagation()
          }
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
            <div
              className="
                absolute
                right-0
                top-7
                z-50
                w-44
                bg-white
                border-2
                border-black
                rounded-xl
                shadow-[3px_3px_0px_#000]
                overflow-hidden
              "
            >

              {/* REPORT */}

              <button
                onClick={() => {
                  console.log(
                    "Report post"
                  );

                  setMenuOpen(false);
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2.5
                  text-xs
                  font-semibold
                  hover:bg-[#FEE2E2]
                "
              >
                <Flag size={14} />

                Report post
              </button>

              {/* VIEW PROFILE */}

              <button
                onClick={() => {
                  navigate(`/profile/${author?._id}`)
                  console.log('Post through id', author?._id);

                  setMenuOpen(false);
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2.5
                  text-xs
                  font-semibold
                  hover:bg-[#F3F4F6]
                "
              >
                <EyeOff size={14} />

                View Profile
              </button>

              {/* UNFRIEND */}

              {friendStatus === "accepted" && (
                <button
                  onClick={() => handleUnfriend()}
                  className="
                    w-full
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2.5
                    text-xs
                    font-semibold
                    hover:bg-[#F3F4F6]
                  "
                >
                  <UserMinus size={14} />

                  Unfriend
                </button>
              )}

            </div>
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* TITLE                                            */}
      {/* ================================================= */}

      {title && (
        <p className="font-semibold text-sm mb-1">
          {title}
        </p>
      )}

      {/* ================================================= */}
      {/* DESCRIPTION                                      */}
      {/* ================================================= */}

      {description && (
        <p className="text-sm text-[#6B7280] leading-relaxed mb-3">
          {description}
        </p>
      )}

      {/* HASHTAGS */}

      {Array.isArray(hashtags) && hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {hashtags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="
                inline-block
                text-[11px]
                font-semibold
                px-2.5
                py-1
                rounded-full
                border border-black/20
                bg-[#F3F4F6]
                text-[#374151]
              "
            >
              #{tag.replace(/^#/, "")}
            </span>
          ))}
        </div>
      )}

      {/* ================================================= */}
      {/* SINGLE IMAGE                                     */}
      {/* ================================================= */}

      {media.length === 1 && (
        <div
          className="
            w-full
            rounded-xl
            border-2
            border-black
            overflow-hidden
            bg-[#F3F4F6]
            mb-3
          "
        >

          <div
            className="
              w-full
              max-h-[330px]
              flex
              items-center
              justify-center
            "
          >

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
      {/* MULTIPLE IMAGES                                  */}
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
                key={
                  item.publicId || index
                }
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
                  alt={`Post media ${index + 1
                    }`}
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

          {/* PREVIOUS */}

          {activeIndex > 0 && (
            <button
              onClick={() =>
                scrollToIndex(
                  activeIndex - 1
                )
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

          {/* NEXT */}

          {activeIndex <
            media.length - 1 && (
              <button
                onClick={() =>
                  scrollToIndex(
                    activeIndex + 1
                  )
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

          {/* IMAGE COUNTER */}

          <span
            className="
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
            "
          >
            {activeIndex + 1}/
            {media.length}
          </span>

        </div>
      )}

      {/* ================================================= */}
      {/* STATS                                            */}
      {/* ================================================= */}

      <div className="flex items-center gap-5 text-[#6B7280] text-xs">

        {/* LIKE */}

        <button
          type="button"
          onClick={handleLike}
          disabled={liking}
          className="
            flex
            items-center
            gap-1.5
            transition
            hover:text-[#EF4444]
            disabled:opacity-60
          "
        >

          <Heart
            size={16}
            className={
              isLiked
                ? "text-[#EF4444]"
                : "text-[#6B7280]"
            }
            fill={
              isLiked
                ? "currentColor"
                : "none"
            }
          />

          <span>
            {likeCount}
          </span>

        </button>

        {/* COMMENTS */}

        <button
          type="button"
          onClick={() => setShowComments(true)}
          className="flex items-center gap-1.5 hover:text-black transition"
        >
          <MessageCircle size={16} />
        </button>

      </div>

      {showComments && (
        <CommentBox
          postId={_id}
          postAuthorId={author?._id}
          currentUserId={author?._id} // Replace with the actual current user ID
          onClose={() => setShowComments(false)}
        />
      )}

    </div>
  );
}
