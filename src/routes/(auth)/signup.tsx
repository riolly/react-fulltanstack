import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import logo from "~/assets/logo.svg";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import authClient from "~/lib/auth/auth-client";

export const Route = createFileRoute({
  component: SignupForm,
});

function SignupForm() {
  const { redirectUrl } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    authClient.signUp.email(
      {
        name,
        email,
        password,
        callbackURL: redirectUrl,
      },
      {
        onError: (ctx) => {
          setErrorMessage(ctx.error.message);
          setIsLoading(false);
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["user"] });
          navigate({ to: redirectUrl });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex h-16 w-16 items-center justify-center rounded-md">
                <img src={logo} alt="Full TanStack Template" className="h-12 w-12" />
              </div>
              <span className="sr-only">Full TanStack Template</span>
            </a>
            <h1 className="text-xl font-bold">Sign up for Full TanStack Template</h1>
          </div>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                readOnly={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hello@example.com"
                readOnly={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                readOnly={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Confirm Password"
                readOnly={isLoading}
                required
              />
            </div>
            <Button type="submit" className="mt-2 w-full" size="lg" disabled={isLoading}>
              {isLoading && <LoaderCircle className="animate-spin" />}
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </div>
          {errorMessage && (
            <span className="text-destructive text-center text-sm">{errorMessage}</span>
          )}
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full"
            type="button"
            disabled={isLoading}
            onClick={() =>
              authClient.signIn.social(
                {
                  provider: "google",
                  callbackURL: redirectUrl,
                },
                {
                  onRequest: () => {
                    setIsLoading(true);
                    setErrorMessage("");
                  },
                  onError: (ctx) => {
                    setIsLoading(false);
                    setErrorMessage(ctx.error.message);
                  },
                },
              )
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Sign up with Google
          </Button>
        </div>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </div>
  );
}
