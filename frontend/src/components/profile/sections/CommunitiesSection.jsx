import { Home } from "lucide-react";

export default function CommunitiesSection() {
  return (
    <div className="bg-white border-[3px] border-ink rounded-2xl p-6 shadow-hard text-center">
      <Home size={40} className="mx-auto mb-3" />
      <h2 className="font-display text-xl font-semibold">
        Communities
      </h2>

      <p className="text-ink/60 mt-2">
        Communities will appear here once this feature is implemented.
      </p>
    </div>
  );
}