
import { Users, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ComingSoon({ feature = "connect" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isConnect = feature === "connect";

  const content = isConnect
    ? {
        icon: Users,
        label: "CONNECT",
        title: "Your campus circle is about to grow.",
        description:
          "Discover people, build meaningful connections, and find your campus community. We're making it easier to meet your people.",
        accent: "bg-purple-200",
        emoji: "🤝",
      }
    : {
        icon: Sparkles,
        label: "SUGGESTIONS",
        title: "Your next campus discovery awaits.",
        description:
          "Find students, communities, and people who share your interests. Smarter suggestions are coming soon.",
        accent: "bg-yellow-200",
        emoji: "✨",
      };

  const FeatureIcon = content.icon;

  const handleGoBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/feed", { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-3xl border-[3px] border-black bg-white p-7 text-center shadow-[6px_6px_0px_#000] sm:p-10">
          {/* Decorative elements */}
          <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full border-[3px] border-black bg-pink-200" />
          <div className="absolute -bottom-8 -left-5 h-24 w-24 rounded-full border-[3px] border-black bg-blue-200" />

          <div className="relative z-10">
            <div
              className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border-[3px] border-black ${content.accent} shadow-[4px_4px_0px_#000]`}
            >
              <FeatureIcon size={42} strokeWidth={2.5} />
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-4 py-2 text-xs font-black tracking-[0.2em] text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              {content.label}
            </span>

            <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              {content.title}
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-600 sm:text-base">
              {content.description}
            </p>

            <div className="my-7 inline-flex rotate-[-2deg] items-center gap-2 rounded-xl border-2 border-black bg-yellow-100 px-5 py-3 font-black shadow-[3px_3px_0px_#000]">
              <span className="text-xl">{content.emoji}</span>
              <span>COMING SOON</span>
            </div>

            <p className="mb-7 text-xs font-medium text-gray-500">
              Good things take a little time. Stay tuned!
            </p>

            <button
              type="button"
              onClick={handleGoBack}
              className="mx-auto flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-gray-100"
            >
              <ArrowLeft size={17} />
              Go Back
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-semibold tracking-wide text-gray-500">
          MADE FOR YOUR CAMPUS · MADE FOR YOU
        </p>
      </div>
    </div>
  );
}
