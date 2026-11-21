"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bounce, toast } from 'react-toastify';

import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type ApiDestination = {
  _id?: string;
  destinationName?: string;
  country?: string;
  category?: string;
  price?: string | number;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
  rating?: number;
};

const fieldClassName = "border-transparent bg-zinc-50";

const categories = [
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "city", label: "City" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "wildlife", label: "Wildlife" },
];

export default function EditDestination({
  destination,
}: {
  destination: ApiDestination | null;
}) {
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!destination?._id) return;
    // Handle form submission logic here
    const formData = new FormData(event.currentTarget);
    const updatedDestination = Object.fromEntries(formData.entries());
    console.log("Updated Destination:", updatedDestination);
    const res = await fetch(
      `http://localhost:8000/destination/${destination._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDestination),
      },
    );
    if (res.ok) {
      router.refresh();
      toast.success("Destination updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-1.5 px-3.5 text-sm font-medium"
          >
            <PencilIcon className="size-3.5" aria-hidden="true" />
            Edit
          </Button>
        }
      />
      {/* Height-constrained dialog: header + footer stay fixed and only the
          fields region scrolls, so the scrollbar never covers the close button
          or footer, and Cancel/Save are always reachable. */}
      <DialogContent className="flex max-h-[calc(100dvh_-_2rem)] flex-col sm:max-w-md">
        <form className="flex min-h-0 flex-1 flex-col gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Travel Package</DialogTitle>
            <DialogDescription>
              Make changes to the travel package details below.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable fields */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:bg-transparent">
            <FieldGroup>
              {/* Destination Name */}
              <Field>
                <Label htmlFor="edit-destination-name">Destination Name</Label>
                <Input
                  id="edit-destination-name"
                  name="destinationName"
                  defaultValue={destination?.destinationName || ""}
                  className={fieldClassName}
                />
              </Field>

              {/* Country + Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="edit-country">Country</Label>
                  <Input
                    id="edit-country"
                    name="country"
                    defaultValue={destination?.country || ""}
                    className={fieldClassName}
                  />
                </Field>
                <Field>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    defaultValue={destination?.category || "beach"}
                    name="category"
                  >
                    <SelectTrigger
                      id="edit-category"
                      className={`w-full ${fieldClassName}`}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* Price + Duration */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <Label htmlFor="edit-price">Price (USD)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    defaultValue={destination?.price?.toString() || ""}
                    className={fieldClassName}
                  />
                </Field>
                <Field>
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    name="duration"
                    defaultValue={destination?.duration || ""}
                    className={fieldClassName}
                  />
                </Field>
              </div>

              {/* Departure Date */}
              <Field>
                <Label htmlFor="edit-departure-date">Departure Date</Label>
                <Input
                  id="edit-departure-date"
                  name="departureDate"
                  type="date"
                  defaultValue={destination?.departureDate || ""}
                  className={fieldClassName}
                />
              </Field>

              {/* Image URL */}
              <Field>
                <Label htmlFor="edit-image-url">Image URL</Label>
                <Input
                  id="edit-image-url"
                  name="imageUrl"
                  type="url"
                  defaultValue={destination?.imageUrl || ""}
                  className={fieldClassName}
                />
              </Field>

              {/* Description */}
              <Field>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={destination?.description || ""}
                  className={`min-h-24 ${fieldClassName}`}
                />
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 gap-1.5 border-destructive/30 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <XIcon aria-hidden="true" />
                  Cancel
                </Button>
              }
            />
            <DialogClose
              render={
                <Button
                  type="submit"
                  className="h-9 gap-1.5 bg-brand px-4 text-white hover:bg-brand/90"
                >
                  <CheckIcon aria-hidden="true" />
                  Save Changes
                </Button>
              }
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
