import { Grid3x3 } from "lucide-react";

export default function PostsSection() {
  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl p-6 shadow-hard text-center">
      <Grid3x3 size={40} className="mx-auto mb-3" />

      <h2 className="font-display text-xl font-semibold">
        Posts
      </h2>

      <p className="text-ink/60 mt-2">
        Posts will appear here once users can create and share posts.
      </p>
    </div>
  );
}