"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangleIcon, Trash2Icon } from "lucide-react";
import { Bounce, toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ApiDestination = {
  _id?: string;
  destinationName?: string;
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

export default function DeleteDestination({
  destination,
}: {
  destination: ApiDestination | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const name = destination?.destinationName?.trim() || "this travel package";

  const handleDelete = async () => {
    if (!destination?._id || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:8000/destination/${destination._id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setOpen(false);
        toast.success("Destination deleted successfully!", toastOptions);
        router.push("/destinations");
        router.refresh();
      } else {
        toast.error(
          "Failed to delete the destination. Please try again.",
          toastOptions,
        );
      }
    } catch {
      toast.error(
        "Failed to delete the destination. Please try again.",
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
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-red-500 px-3.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            <Trash2Icon className="size-3.5" aria-hidden="true" />
            Delete
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
            <DialogTitle className="text-lg">Delete Travel Package</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-zinc-900">
              &apos;{name}&apos;
            </span>
            ? This action cannot be undone and will permanently remove this
            travel package from the system.
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
            Cancel
          </Button>
          <Button
            type="button"
            className="h-9 gap-1.5 bg-red-500 px-4 text-white hover:bg-red-600"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2Icon aria-hidden="true" />
            {isDeleting ? "Deleting..." : "Delete Package"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
