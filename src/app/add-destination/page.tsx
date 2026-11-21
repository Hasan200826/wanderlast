"use client";

import type { FormEvent } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { redirect } from "next/navigation";

const fieldClassName = "border-transparent bg-zinc-50";

const categories = [
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "city", label: "City" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "wildlife", label: "Wildlife" },
];

export default function AddDestinationPage() {
  const handleSubmit =async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formInfo = Object.fromEntries(formData.entries())

    console.log("Travel package form info:", formInfo);
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URI}/destination`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formInfo)
    })
    if (res.ok) {
      redirect('/destinations')
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-light tracking-tight text-zinc-900 md:text-4xl lg:text-5xl">
        Add New Travel Package
      </h1>

      <Card className="mx-auto mt-8 w-full max-w-2xl gap-5 px-6 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Destination Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="destination-name">Destination Name</Label>
            <Input
              id="destination-name"
              name="destinationName"
              placeholder="Bali Paradise"
              className={fieldClassName}
            />
          </div>

          {/* Country + Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                placeholder="Indonesia"
                className={fieldClassName}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select defaultValue="beach" name="category">
                <SelectTrigger
                  id="category"
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
            </div>
          </div>

          {/* Price + Duration */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="e.g. 1099"
                className={fieldClassName}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g. 7 Days/6 Nights"
                className={fieldClassName}
              />
            </div>
          </div>

          {/* Departure Date */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="departure-date">Departure Date</Label>
            <Input
              id="departure-date"
              name="departureDate"
              type="date"
              className={fieldClassName}
            />
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              className={fieldClassName}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the travel experience..."
              className={`min-h-24 ${fieldClassName}`}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <Button
              type="reset"
              variant="outline"
              className="h-9 border-destructive/30 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <XIcon />
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-9 bg-brand px-4 text-white hover:bg-brand/90"
            >
              <PlusIcon />
              Add Travel Package
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
