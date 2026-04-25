import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useIsAdmin();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Set document title + noindex
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Admin · Creek Construction";
    let meta = document.querySelector('meta[name="robots"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    const prevContent = meta.getAttribute("content");
    meta.setAttribute("content", "noindex,nofollow");
    return () => {
      document.title = prevTitle;
      if (created) meta?.remove();
      else if (prevContent) meta?.setAttribute("content", prevContent);
    };
  }, []);

  // If already an admin, kick straight to the library.
  useEffect(() => {
    if (!loading && !checking && user && isAdmin) {
      const dest =
        (location.state as { from?: { pathname: string } } | null)?.from
          ?.pathname ?? "/admin/media";
      navigate(dest, { replace: true });
    }
  }, [user, isAdmin, loading, checking, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Welcome back" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/media`,
          },
        });
        if (error) throw error;
        toast({
          title: "Account created",
          description: "You are now signed in.",
        });
      }
    } catch (err) {
      toast({
        title: mode === "signin" ? "Sign-in failed" : "Sign-up failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="w-full max-w-md p-8 space-y-6 border-border/60">
          <div className="space-y-2 text-center">
            <Link
              to="/"
              className="inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-cedar transition-colors"
            >
              Creek Construction
            </Link>
            <h1 className="font-serif text-3xl text-foreground">
              {mode === "signin" ? "Admin sign-in" : "Create admin account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "signin"
                ? "Access the media library."
                : "First account created becomes the admin."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting
                ? "Working…"
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                No account yet?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-cedar hover:underline underline-offset-2"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-cedar hover:underline underline-offset-2"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
  );
};

export default AdminLogin;
