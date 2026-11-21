
"use client";

import { useEffect } from "react";
import {
  CameraIcon,
  DollarSignIcon,
  GlobeIcon,
  MapPinIcon,
  PencilIcon,
  PlaneIcon,
  TrendingUpIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/**
 * Profile-only fields
 */
type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
  location?: string;
  memberSince?: string;
  nationality?: string;
};

/**
 * Travel statistics
 */
const statistics = [
  {
    label: "Total Bookings",
    value: "12",
    icon: PlaneIcon,
    iconClassName: "bg-cyan-50 text-cyan-600",
  },
  {
    label: "Countries Visited",
    value: "18",
    icon: GlobeIcon,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "Upcoming Trips",
    value: "2",
    icon: TrendingUpIcon,
    iconClassName: "bg-orange-50 text-orange-500",
  },
  {
    label: "Total Spent",
    value: "$15,750",
    icon: DollarSignIcon,
    iconClassName: "bg-pink-50 text-pink-500",
  },
];

export default function ProfilePage() {
  const router = useRouter();

  // Get session using Better Auth hook
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as ProfileUser | undefined;

  // Redirect if user is not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  // Sign out handler
  const handleSignOutBtn = async () => {
    try {
      await authClient.signOut();

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // Loading state
  if (isPending || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-500">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-light tracking-tight text-zinc-900 md:text-4xl lg:text-5xl">
        My Profile
      </h1>

      <p className="mt-2 text-sm text-zinc-500">
        Manage your account settings and travel preferences
      </p>

      <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_1fr]">

        {/* Profile card */}
        <Card className="gap-5 px-6 py-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="size-24">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name}
                />

                <AvatarFallback className="text-lg">
                  {user.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                aria-label="Change profile photo"
                className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-brand text-white ring-2 ring-white transition-colors hover:bg-brand/90"
              >
                <CameraIcon className="size-4" />
              </button>
            </div>

            <h2 className="mt-4 text-base font-semibold text-zinc-900">
              {user.name}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {user.email}
            </p>

            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-zinc-500">
              <MapPinIcon
                className="size-3.5"
                aria-hidden="true"
              />
              {user.location || "Location not added"}
            </p>
          </div>

          {/* Profile information */}
          <div className="-mx-6 flex flex-col gap-3 border-t border-zinc-100 px-6 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">
                Member since
              </span>

              <span className="font-semibold text-zinc-900">
                {user.memberSince || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">
                Nationality
              </span>

              <span className="font-semibold text-zinc-900">
                {user.nationality || "N/A"}
              </span>
            </div>
          </div>

          <Button
            type="button"
            className="h-10 w-full gap-2 bg-brand text-white hover:bg-brand/90"
          >
            <PencilIcon />
            Edit Profile
          </Button>
        </Card>

        {/* Travel statistics */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Travel Statistics
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {statistics.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-3 rounded-xl border border-zinc-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm text-zinc-500">
                    {stat.label}
                  </span>

                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${stat.iconClassName}`}
                  >
                    <stat.icon
                      className="size-4"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <span className="text-xl font-semibold text-zinc-900">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Sign out button */}
          <Button
            onClick={handleSignOutBtn}
            type="button"
            className="mt-4 h-10 w-40 gap-2 bg-brand text-white hover:bg-brand/90"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

