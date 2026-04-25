import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface RequireAdminProps {
  children: React.ReactNode;
}

/**
 * Route guard for /admin/*.
 * - Loading: shows a quiet spinner (no flash).
 * - Not signed in: redirect to /admin/login.
 * - Signed in but not admin: forbidden screen.
 */
const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, checking } = useIsAdmin();
  const location = useLocation();

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-2 w-2 rounded-full bg-cedar animate-pulse" aria-hidden />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="font-serif text-3xl text-foreground">Not authorized</h1>
          <p className="text-sm text-muted-foreground">
            This area is restricted. Sign in with an admin account to continue.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
