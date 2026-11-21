"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { MailIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export default function SignUpPage() {
  const router = useRouter();
  useGoogleAuthErrorToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formInfo = Object.fromEntries(formData.entries());

    const { fullName, email, profilePicture, password } = formInfo;
    const { error } = await authClient.signUp.email({
      name: fullName as string,
      email: email as string,
      image: profilePicture as string,
      password: password as string,
    });
    if (error) {
      toast.error(
        error.message ?? "Could not create your account. Please try again.",
        oauthToastOptions,
      );
    } else {
      router.push("/");
    }
  };

  const handleGoogleBtn = async () => {
    // Send the user back to this page (with ?error=<code>) if Google
    // sign-up fails, e.g. because the email already has an account.
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/signup",
    });

    if (error) {
      toast.error(googleAuthErrorMessage(error.code), oauthToastOptions);
    }
  };


  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Start your adventure with Wanderlust
        </p>

        <Card className="mt-8 gap-5 px-6 py-6 text-left shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full-name">Full Name</Label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="full-name"
                  name="fullName"
                  type="text"
                  placeholder="Enter your name"
                  autoComplete="name"
                  className={fieldClassName}
                />
              </div>
            </div>

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
            {/* Profile Picture */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-picture">Profile Picture</Label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="profile-picture"
                  name="profilePicture"
                  type="url"
                  placeholder="Enter profile picture URL"
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
                placeholder="Create a password"
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <PasswordInput
                id="confirm-password"
                name="confirmPassword"
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div> */}

            {/* Create Account */}
            <Button
              type="submit"
              className="h-10 w-full bg-brand text-white hover:bg-brand/90"
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-zinc-200" />
            <span className="text-sm text-zinc-500">Or sign up with</span>
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
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
