import { Link } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-8">
      <EmptyState
        title="Page not found"
        description="This frontend route does not exist yet."
        action={
          <Button asChild>
            <Link to="/">Back home</Link>
          </Button>
        }
      />
    </main>
  );
}
