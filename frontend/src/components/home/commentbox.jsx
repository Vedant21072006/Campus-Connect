import { useEffect, useRef, useState } from "react";
import { X, MoreHorizontal, Flag, User, Trash2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getComments, createComment, deleteComment } from "../../services/postApi.js";

const MAX_WORDS = 200;

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// postAuthorId  = the post owner's _id (post owners can delete any comment on their post)
// currentUserId = the logged-in user's _id — wire this up to your auth context (see note in chat)
export default function CommentBox({ postId, postAuthorId, currentUserId, onClose }) {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // =====================================================
  // LOAD COMMENTS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getComments(postId);
        if (!cancelled) setComments(data.comments || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load comments");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  // =====================================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =====================================================
  // POST COMMENT
  // =====================================================

  const draftWordCount = wordCount(draft);
  const overLimit = draftWordCount > MAX_WORDS;

  const handlePost = async () => {
    const trimmed = draft.trim();
    if (!trimmed || overLimit || posting) return;

    try {
      setPosting(true);
      const data = await createComment(postId, trimmed);
      setComments((prev) => [data.comment, ...prev]);
      setDraft("");
    } catch (err) {
      alert(err.message || "Could not post comment");
    } finally {
      setPosting(false);
    }
  };

  // =====================================================
  // DELETE COMMENT
  // =====================================================

  const handleDelete = async (commentId) => {
    setOpenMenuId(null);
    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.message || "Could not delete comment");
    }
  };

  // =====================================================
  // REPORT COMMENT
  // =====================================================

  const handleReport = (commentId) => {
    setOpenMenuId(null);
    const reason = window.prompt("Tell us why you are reporting this comment:");
    if (!reason) return;

    // NOTE: no report-comment endpoint was included with the comment
    // controllers you shared — this just logs for now. Wire it up once
    // you add a real route (see note in chat).
    console.log("Report comment", commentId, reason);
    alert("Report submitted. Our team will review it shortly.");
  };

  // =====================================================
  // VIEW PROFILE
  // =====================================================

  const handleViewProfile = (authorId) => {
    setOpenMenuId(null);
    onClose?.();
    navigate(`/profile/${authorId}`);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full sm:w-[420px]
          max-h-[85vh]
          bg-white
          border-2 border-black
          rounded-t-2xl sm:rounded-2xl
          shadow-[4px_4px_0px_#000]
          flex flex-col
          overflow-hidden
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black shrink-0">
          <p className="font-bold text-sm">Comments</p>
          <button
            type="button"
            onClick={onClose}
            className="
              w-7 h-7 flex items-center justify-center
              rounded-full border-2 border-black
              bg-white hover:bg-[#F3F4F6] transition
            "
            aria-label="Close comments"
          >
            <X size={14} />
          </button>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {loading && (
            <p className="text-xs text-[#6B7280] text-center py-6">
              Loading comments...
            </p>
          )}

          {!loading && error && (
            <p className="text-xs text-[#EF4444] text-center py-6">{error}</p>
          )}

          {!loading && !error && comments.length === 0 && (
            <p className="text-xs text-[#6B7280] text-center py-6">
              No comments yet — be the first!
            </p>
          )}

          {!loading &&
            !error &&
            comments.map((comment) => {
              const authorId = comment.author?._id;
              const authorName = comment.author?.username || "Unknown User";
              const canDelete =
                !!currentUserId &&
                (authorId === currentUserId || postAuthorId === currentUserId);

              return (
                <div key={comment._id} className="flex gap-2.5">
                  {/* AVATAR */}
                  <div className="w-8 h-8 shrink-0 rounded-full bg-[#FACC15] border-2 border-black flex items-center justify-center text-xs font-bold overflow-hidden">
                    {comment.author?.profilePicture?.url ? (
                      <img
                        src={comment.author.profilePicture.url}
                        alt={authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      authorName?.[0]?.toUpperCase() || "U"
                    )}
                  </div>

                  {/* BODY */}
                  <div className="min-w-0 flex-1">
                    <div className="bg-[#F3F4F6] border-2 border-black rounded-xl px-3 py-2">
                      <p className="font-bold text-xs">{authorName}</p>
                      <p className="text-xs text-black mt-0.5 whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>
                    </div>
                  </div>

                  {/* MENU */}
                  <div
                    className="relative shrink-0"
                    ref={openMenuId === comment._id ? menuRef : null}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId((id) => (id === comment._id ? null : comment._id))
                      }
                      className="text-[#6B7280] hover:text-black transition mt-1"
                      aria-label="Comment options"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {openMenuId === comment._id && (
                      <div
                        className="
                          absolute right-0 top-6 z-10 w-40
                          bg-white border-2 border-black rounded-xl
                          shadow-[3px_3px_0px_#000] overflow-hidden
                        "
                      >
                        <button
                          type="button"
                          onClick={() => handleReport(comment._id)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-[#FEE2E2] text-[#EF4444]"
                        >
                          <Flag size={13} />
                          Report
                        </button>

                        <button
                          type="button"
                          onClick={() => handleViewProfile(authorId)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-[#F3F4F6] border-t-2 border-black"
                        >
                          <User size={13} />
                          View Profile
                        </button>

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(comment._id)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-[#FEE2E2] text-[#EF4444] border-t-2 border-black"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* COMPOSER */}
        <div className="border-t-2 border-black px-4 py-3 shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              className="
                flex-1 resize-none
                text-xs
                border-2 border-black rounded-xl
                px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-[#FFD93D]
              "
            />
            <button
              type="button"
              onClick={handlePost}
              disabled={!draft.trim() || overLimit || posting}
              className="
                w-9 h-9 shrink-0 flex items-center justify-center
                rounded-full border-2 border-black
                bg-[#FFD93D]
                shadow-[2px_2px_0px_#000]
                hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none
                disabled:opacity-50
                transition-all
              "
              aria-label="Post comment"
            >
              <Send size={14} />
            </button>
          </div>

          <p
            className={`text-[10px] mt-1 text-right ${
              overLimit ? "text-[#EF4444] font-semibold" : "text-[#9CA3AF]"
            }`}
          >
            {draftWordCount}/{MAX_WORDS} words
          </p>
        </div>
      </div>
    </div>
  );
}