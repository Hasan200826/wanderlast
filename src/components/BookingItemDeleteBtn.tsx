"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangleIcon, Trash2Icon } from "lucide-react";
import { Bounce, toast } from "react-toastify";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type BookingItemDeleteBtnProps = {
  booking: { id: string; title?: string };
};

const toastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
} as const;

const BookingItemDeleteBtn = ({ booking }: BookingItemDeleteBtnProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const title = booking.title?.trim() || "this booking";

  const handleDeleteBooking = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:8000/my-destinations/${booking.id}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        setOpen(false);
        toast.success("Booking cancelled successfully!", toastOptions);
        router.refresh();
      } else {
        toast.error(
          "Failed to cancel the booking. Please try again.",
          toastOptions,
        );
      }
    } catch {
      toast.error(
        "Failed to cancel the booking. Please try again.",
        toastOptions,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 border-[#f9b3b3] bg-white px-4 text-[#ef4444] hover:bg-[#fff5f5] hover:text-[#ef4444]"
          >
            <Trash2Icon className="h-4 w-4" aria-hidden="true" />
            Cancel
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangleIcon
                className="size-4.5 text-red-500"
                aria-hidden="true"
              />
            </span>
            <DialogTitle className="text-lg">Cancel Booking</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-600">
            Are you sure you want to cancel{" "}
            <span className="font-semibold text-zinc-900">
              &apos;{title}&apos;
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-4"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Keep Booking
          </Button>
          <Button
            type="button"
            className="h-9 gap-1.5 bg-red-500 px-4 text-white hover:bg-red-600"
            onClick={handleDeleteBooking}
            disabled={isDeleting}
          >
            <Trash2Icon aria-hidden="true" />
            {isDeleting ? "Cancelling..." : "Cancel Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingItemDeleteBtn;
