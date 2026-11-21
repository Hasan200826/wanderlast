"use client";

import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client"; // import the auth client

type ApiDestination = {
  destinationName?: string;
  country?: string;
  price?: string | number;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
};

const { data: session } = await authClient.getSession();

const BookNowBtn = ({ destination }: { destination?: unknown }) => {
  // console.log(session?.user);
  const name = session?.user.name ?? "";
  const email = session?.user.email ?? "";
  console.log(name, email);

  const handleBookNowBtn = async () => {
    const bookingDate = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Dhaka",
    });
    const myBooking = {
      userName: name,
      userEmail: email,
      bookingDate: bookingDate,
      ...(destination as ApiDestination),
    };
    // console.log(myBooking);

    const res = await fetch("http://localhost:8000/my-destinations", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(myBooking),
    });
    if (res.ok) {
      redirect("/bookings");
    }
  };

  return (
    <div>
      <Input
        type="date"
        aria-label="Travel date"
        defaultValue="2026-05-15"
        className="h-10 border-zinc-200 bg-white px-3"
      />
      <Button
        onClick={handleBookNowBtn}
        className=" mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand/90"
      >
        Book now
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
};

export default BookNowBtn;
