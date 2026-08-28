import {useEffect, useMemo, useState } from "react";

import {
  Users2,
  Search,
  MoreHorizontal,
  UserRound,
  MessageCircle,
  Pin,
  UserMinus,
  Ban,
} from "lucide-react";

import {
  getFriends,
  removeFriend,
} from "../../../services/friendshipApi";

export default function SocialSection({userId}) {

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  
  // =========================
  // GET FRIENDS
  // =========================

  useEffect(() => {
    const fetchFriends = async () => {
      try {
       
        
        setLoading(true);

        const data = await getFriends(userId);

        console.log("Friends:", data);

        if (data.success) {
          setFriends(data.friends || []);
        }
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // =========================
  // SEARCH FRIENDS
  // =========================

  const filteredFriends = useMemo(() => {
    if (!search.trim()) {
      return friends;
    }

    const query = search.toLowerCase().trim();

    return friends.filter((friend) => {
      const user = friend.user;

      const fullName =
        `${user?.firstName || ""} ${user?.lastName || ""}`
          .toLowerCase();

      const username =
        user?.username?.toLowerCase() || "";

      return (
        fullName.includes(query) ||
        username.includes(query)
      );
    });
  }, [friends, search]);

  // =========================
  // REMOVE FRIEND
  // =========================

  const handleRemoveFriend = async (friend) => {
    const user = friend.user;

    if (!user?._id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to unfriend ${user.firstName} ${user.lastName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeFriend(user._id);

      // Immediately remove from UI
      setFriends((prevFriends) =>
        prevFriends.filter(
          (item) => item.friendshipId !== friend.friendshipId
        )
      );

      setOpenMenu(null);
    } catch (error) {
      console.error("Remove friend error:", error);

      alert(
        error.message || "Failed to remove friend"
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="font-display font-semibold text-sm">
          Loading friends...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex items-center justify-between mb-7">

        {/* TITLE */}

        <div className="flex items-center gap-2">

          <Users2 size={21} />

          <h2 className="font-display text-xl font-semibold">
            Friends
          </h2>

          <span className="text-xs font-semibold bg-bubblegum border-2 border-ink rounded-full px-2.5 py-0.5">
            {friends.length}
          </span>

        </div>

        {/* =========================
            SEARCH
        ========================= */}

        {friends.length > 0 && (
          <div className="relative w-48">

            <Search
              size={15}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-ink/50
              "
            />

            <input
              type="text"
              placeholder="Search friends..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                pl-9
                pr-3
                py-2
                text-xs
                bg-white
                border-[2px]
                border-ink
                rounded-full
                outline-none
                focus:shadow-hard-sm
                transition-all
              "
            />

          </div>
        )}

      </div>

      {/* =========================
          NO FRIENDS
      ========================= */}

      {friends.length === 0 && (
        <div className="py-10 text-center">

          <Users2
            size={35}
            className="
              mx-auto
              mb-3
              text-ink/40
            "
          />

          <p className="font-display font-semibold">
            No friends yet
          </p>

          <p className="text-sm text-ink/50 mt-1">
            Start connecting with people around you.
          </p>

        </div>
      )}

      {/* =========================
          NO SEARCH RESULTS
      ========================= */}

      {friends.length > 0 &&
        filteredFriends.length === 0 && (
          <div className="py-10 text-center">

            <Search
              size={32}
              className="
                mx-auto
                mb-3
                text-ink/40
              "
            />

            <p className="font-display font-semibold">
              No friends found
            </p>

            <p className="text-sm text-ink/50 mt-1">
              Try searching for another name.
            </p>

          </div>
        )}

      {/* =========================
          FRIEND GRID
      ========================= */}

      {filteredFriends.length > 0 && (
        <div
          className="
            grid
            grid-cols-3
            sm:grid-cols-4
            md:grid-cols-5
            lg:grid-cols-6
            gap-x-5
            gap-y-8
          "
        >

          {filteredFriends.map((friend) => {

            const user = friend.user;

            const fullName =
              `${user?.firstName || ""} ${
                user?.lastName || ""
              }`.trim();

            const profileImage =
              user?.profilePicture?.url || null;

            const menuId = friend.friendshipId;

            return (
              <div
                key={friend.friendshipId}
                className="
                  group
                  relative
                  flex
                  flex-col
                  items-center
                  w-full
                "
              >

                {/* =========================
                    THREE DOTS
                    ONLY VISIBLE ON HOVER
                ========================= */}

                <div
                  className="
                    absolute
                    top-[-5px]
                    right-1
                    z-30
                    opacity-0
                    scale-90
                    pointer-events-none
                    group-hover:opacity-100
                    group-hover:scale-100
                    group-hover:pointer-events-auto
                    transition-all
                    duration-150
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === menuId
                          ? null
                          : menuId
                      )
                    }
                    className="
                      w-8
                      h-8
                      flex
                      items-center
                      justify-center
                      bg-white
                      border-[2px]
                      border-ink
                      rounded-full
                      shadow-hard-sm
                      hover:translate-y-[1px]
                      hover:shadow-none
                      transition-all
                    "
                  >
                    <MoreHorizontal size={17} />
                  </button>

                  {/* =========================
                      DROPDOWN
                  ========================= */}

                  {openMenu === menuId && (
                    <div
                      className="
                        absolute
                        right-0
                        top-9
                        z-50
                        w-44
                        bg-white
                        border-[2.5px]
                        border-ink
                        rounded-xl
                        shadow-hard
                        overflow-hidden
                      "
                    >

                      {/* VIEW PROFILE */}

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);

                          // Add navigation later
                          // navigate(`/profile/${user._id}`);
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
                          hover:bg-cream
                          transition-colors
                        "
                      >
                        <UserRound size={14} />
                        View Profile
                      </button>

                      {/* CHAT */}

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);

                          // Chat functionality later
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
                          hover:bg-cream
                          transition-colors
                        "
                      >
                        <MessageCircle size={14} />
                        Chat
                      </button>

                      {/* PIN */}

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);

                          // Pin best friend API later
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
                          hover:bg-cream
                          transition-colors
                        "
                      >
                        <Pin size={14} />
                        Pin as Best Friend
                      </button>

                      {/* UNFRIEND */}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveFriend(friend)
                        }
                        className="
                          w-full
                          flex
                          items-center
                          gap-2
                          px-3
                          py-2.5
                          text-xs
                          font-semibold
                          text-red-500
                          hover:bg-red-50
                          transition-colors
                        "
                      >
                        <UserMinus size={14} />
                        Unfriend
                      </button>

                      {/* BLOCK */}

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);

                          // Block API later
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
                          text-red-600
                          hover:bg-red-50
                          transition-colors
                        "
                      >
                        <Ban size={14} />
                        Block
                      </button>

                    </div>
                  )}

                </div>

                {/* =========================
                    PROFILE IMAGE
                ========================= */}

                <div
                  className="
                    w-[76px]
                    h-[76px]
                    sm:w-[82px]
                    sm:h-[82px]
                    rounded-full
                    overflow-hidden
                    border-[2.5px]
                    border-ink
                    bg-cream
                    flex
                    items-center
                    justify-center
                    transition-transform
                    duration-200
                    group-hover:scale-[1.04]
                  "
                >

                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={fullName || "Friend"}
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />
                  ) : (
                    <UserRound
                      size={28}
                      className="text-ink/40"
                    />
                  )}

                </div>

                {/* =========================
                    NAME
                ========================= */}

                <p
                  className="
                    mt-2
                    text-sm
                    font-display
                    font-semibold
                    text-center
                    max-w-[110px]
                    truncate
                  "
                  title={fullName}
                >
                  {fullName || "Unknown User"}
                </p>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}