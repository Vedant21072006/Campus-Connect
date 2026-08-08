import { Users2 } from "lucide-react";
import ComingSoonSection from "./ComingSoonSection.jsx";

export default function SocialSection() {
  return (
    <ComingSoonSection
      icon={Users2}
      title="Social"
      description="Friends, friend requests, messaging, and mutual friends will be available in a future update."
      previewLabels={[
        "👥 Friends",
        "💬 Messages",
        "🤝 Friend Requests",
        "⭐ Mutual Friends",
      ]}
    />
  );
}