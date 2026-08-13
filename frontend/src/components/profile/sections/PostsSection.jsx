import { useEffect, useState } from "react";
import {
  Grid3x3,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import {
  getMyPosts,
  deletePost
} from "../../../services/postApi.js";

export default function PostsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  // =========================
  // GET MY POSTS
  // =========================

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);

        const data = await getMyPosts();

        if (data.success) {
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Failed to fetch my posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  // =========================
  // DELETE POST
  // =========================

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await deletePost(postId);

      // Immediately remove deleted post from UI
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );

      setOpenMenu(null);
    } catch (error) {
      console.error("Delete post error:", error);
      alert(error.message || "Failed to delete post");
    }
  };

  // =========================
  // PIN - DISABLED FOR NOW
  // =========================

  /*
  const handlePin = async (postId) => {
    try {
      const data = await pinPost(postId);

      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  pinned: data.post.pinned,
                }
              : post
          )
        );
      }

      setOpenMenu(null);
    } catch (error) {
      console.error("Pin post error:", error);
      alert(error.message || "Failed to pin post");
    }
  };
  */

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="bg-white border-[3px] border-ink rounded-2xl p-10 shadow-hard text-center">
        <p className="font-display font-semibold">
          Loading your posts...
        </p>
      </div>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================

  if (posts.length === 0) {
    return (
      <div className="bg-white border-[3px] border-ink rounded-2xl p-10 shadow-hard text-center">
        <Grid3x3
          size={40}
          className="mx-auto mb-3"
        />

        <h2 className="font-display text-xl font-semibold">
          Posts
        </h2>

        <p className="text-ink/60 mt-2">
          Posts will appear here once you create them.
        </p>
      </div>
    );
  }

  // =========================
  // POSTS
  // =========================

  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl p-5 shadow-hard">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3x3 size={20} />

          <h2 className="font-display text-xl font-semibold">
            Posts
          </h2>
        </div>

        <span className="text-xs font-semibold bg-bubblegum border-2 border-ink rounded-full px-3 py-1">
          {posts.length}
        </span>
      </div>

      {/* SCROLLABLE POSTS AREA */}

      <div className="max-h-[520px] overflow-y-auto pr-1">

        <div className="grid grid-cols-3 gap-3">

          {posts.map((post) => {

            const media = post.metadata?.media || [];

            const image =
              media.length > 0
                ? media[0]?.url
                : null;

            return (
              <div
                key={post._id}
                className="bg-white border-[2.5px] border-ink rounded-xl overflow-hidden shadow-hard-sm hover:translate-y-[-2px] transition-transform"
              >

                {/* IMAGE */}

                <div className="relative aspect-square bg-cream overflow-hidden">

                  {image ? (
                    <img
                      src={image}
                      alt={post.metadata?.title || "Post"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">

                      <Grid3x3
                        size={24}
                        className="mb-2 text-ink/40"
                      />

                      <p className="text-xs font-semibold line-clamp-3">
                        {post.metadata?.title ||
                          post.metadata?.description ||
                          "Text Post"}
                      </p>

                    </div>
                  )}

                  {/* THREE DOTS */}

                  <div className="absolute top-2 right-2">

                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === post._id
                            ? null
                            : post._id
                        )
                      }
                      className="bg-white border-2 border-ink rounded-full p-1 shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                    >
                      <MoreHorizontal size={15} />
                    </button>

                    {/* DROPDOWN */}

                    {openMenu === post._id && (
                      <div className="absolute right-0 top-8 z-30 w-32 bg-white border-[2.5px] border-ink rounded-xl shadow-hard overflow-hidden">

                        {/* PIN DISABLED FOR NOW */}

                        {/*
                        <button
                          type="button"
                          onClick={() => handlePin(post._id)}
                          className="w-full px-3 py-2.5 flex items-center gap-2 text-xs font-semibold hover:bg-cream transition-colors"
                        >
                          <Pin size={13} />

                          {post.pinned
                            ? "Unpin"
                            : "Pin"}
                        </button>
                        */}

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(post._id)
                          }
                          className="w-full px-3 py-2.5 flex items-center gap-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} />

                          Delete
                        </button>

                      </div>
                    )}

                  </div>

                </div>

                {/* POST INFO */}

                <div className="p-2.5">

                  {/* TITLE */}

                  <p className="font-display font-semibold text-xs line-clamp-1">
                    {post.metadata?.title ||
                      "Untitled Post"}
                  </p>

                  {/* DESCRIPTION */}

                  {post.metadata?.description && (
                    <p className="text-[10px] text-ink/55 mt-1 line-clamp-2">
                      {post.metadata.description}
                    </p>
                  )}

                  {/* STATS */}

                  <div className="flex items-center gap-3 mt-2 pt-2 border-t-[1.5px] border-ink/10">

                    <span className="flex items-center gap-1 text-[10px] text-ink/60">
                      <Heart
                        size={11}
                        className="text-red-500"
                        fill="currentColor"
                      />

                      {post.stats?.likes || 0}
                    </span>

                    <span className="flex items-center gap-1 text-[10px] text-ink/60">
                      <MessageCircle size={11} />

                      {post.stats?.comments || 0}
                    </span>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}