import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="font-display text-8xl font-bold text-surface2">404</span>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">This page drifted off-screen.</h1>
      <p className="mt-2 max-w-sm text-haze">
        The page you're looking for doesn't exist, or may have been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
