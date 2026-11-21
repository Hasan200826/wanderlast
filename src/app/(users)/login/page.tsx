"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/google-icon";
import { PasswordInput } from "@/components/password-input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  googleAuthErrorMessage,
  oauthToastOptions,
  useGoogleAuthErrorToast,
} from "@/lib/oauth-error";

const fieldClassName = "border-transparent bg-zinc-50 pl-9";

export default function LogInPage() {
  const route = useRouter();
  useGoogleAuthErrorToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formInfo = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };
    const { data, error: logError } = await authClient.signIn.email({
      ...formInfo,
    });
    if (data?.user) {
      route.push("/");
    } else {
      toast.error(
        logError?.message ?? "Invalid email or password. Please try again.",
        oauthToastOptions,
      );
    }
  };

  const handleGoogleBtn = async () => {
    // Send the user back to this page (with ?error=<code>) if Google
    // sign-in fails, e.g. because the email already has an account.
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/login",
    });

    if (error) {
      toast.error(googleAuthErrorMessage(error.code), oauthToastOptions);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Resume your adventure with Wanderlust
        </p>

        <Card className="mt-8 gap-5 px-6 py-6 text-left shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className={fieldClassName}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="remember-me"
                className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700"
              >
                <Checkbox id="remember-me" name="remember" />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-brand hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In */}
            <Button
              type="submit"
              className="h-10 w-full bg-brand text-white hover:bg-brand/90"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-zinc-200" />
            <span className="text-sm text-zinc-500">Or continue with</span>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>

          {/* Google sign up */}
          <Button
            onClick={handleGoogleBtn}
            type="button"
            variant="outline"
            className="h-10 w-full gap-2 bg-white"
          >
            <GoogleIcon />
            Sign Up With Google
          </Button>
        </Card>

        <p className="mt-5 text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-brand hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
