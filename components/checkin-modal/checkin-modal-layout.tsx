"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

// Types
interface Location {
  id: string;
  name: string;
  slug: string;
}

interface BookingModalProps {
  trigger: React.ReactNode;
  defaultLocationId?: string;
  className?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  trigger,
  defaultLocationId,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Form data state
  const [formData, setFormData] = useState({
    checkin: "",
    checkout: "",
    adults: 1,
    childrens: 0,
    location: defaultLocationId || "",
  });

  // Fetch locations when component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  // Update location when defaultLocationId changes
  useEffect(() => {
    if (defaultLocationId) {
      setFormData((prev) => ({ ...prev, location: defaultLocationId }));
    }
  }, [defaultLocationId]);

  const fetchLocations = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/locations");
      const { success, data, error } = await response.json();

      if (!success) {
        throw new Error(error || "Failed to fetch locations");
      }

      setLocations(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load locations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateDates = (): string | null => {
    const checkInDate = new Date(formData.checkin);
    const checkOutDate = new Date(formData.checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return "Check-in date cannot be in the past";
    }
    if (checkOutDate <= checkInDate) {
      return "Check-out date must be after check-in date";
    }
    return null;
  };

  const handleSearch = (): void => {
    // Check for location
    if (!formData.location) {
      toast({
        title: "Error",
        description: "Please select a location",
        variant: "destructive",
      });
      return;
    }

    // Check for dates
    if (!formData.checkin || !formData.checkout) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    const dateError = validateDates();
    if (dateError) {
      toast({
        title: "Error",
        description: dateError,
        variant: "destructive",
      });
      return;
    }

    // Check for adults
    if (formData.adults < 1) {
      toast({
        title: "Error",
        description: "At least one adult is required",
        variant: "destructive",
      });
      return;
    }

    // All validations passed, proceed with search
    const selectedLocation = locations.find(
      (loc) => loc.id === formData.location
    );

    if (selectedLocation) {
      const searchParams = new URLSearchParams({
        checkIn: formData.checkin,
        checkOut: formData.checkout,
        adults: formData.adults.toString(),
        childrens: formData.childrens.toString(),
      });

      setOpen(false); // Close modal before navigation
      router.push(
        `/locations-slug/${selectedLocation.slug}?${searchParams.toString()}`
      );
    } else {
      // This is a fallback in case the selected location is not found
      toast({
        title: "Error",
        description: "Selected location not found",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogTrigger asChild>
        <div className={className}>{trigger}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-comfortaaBold">
            Book Your Stay
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col">
              <Label htmlFor="location" className="mb-1 font-comfortaaBold">
                Destination
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
                value={formData.location}
              >
                <SelectTrigger className="text-sm h-10 font-comfortaaBold">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem
                      key={loc.id}
                      value={loc.id}
                      className="font-comfortaaRegular data-[state=checked]:text-primary data-[state=checked]:bg-primary/10"
                    >
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <Label htmlFor="checkin" className="mb-1 font-comfortaaBold">
                  Check-in
                </Label>
                <Input
                  type="date"
                  id="checkin"
                  value={formData.checkin}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, checkin: e.target.value })
                  }
                  className="text-sm h-10 font-comfortaaBold"
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="checkout" className="mb-1 font-comfortaaBold">
                  Check-out
                </Label>
                <Input
                  type="date"
                  id="checkout"
                  value={formData.checkout}
                  min={
                    formData.checkin || new Date().toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, checkout: e.target.value })
                  }
                  className="text-sm h-10 font-comfortaaBold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <Label htmlFor="adults" className="mb-1 font-comfortaaBold">
                  Adults
                </Label>
                <Input
                  type="number"
                  id="adults"
                  value={formData.adults}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      adults: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  min={1}
                  className="text-sm h-10 font-comfortaaBold"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="childrens" className="mb-1 font-comfortaaBold">
                  Children
                </Label>
                <Input
                  type="number"
                  id="childrens"
                  value={formData.childrens}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      childrens: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  min={0}
                  className="text-sm h-10 font-comfortaaBold"
                />
              </div>
            </div>
          </div>
        </div>
        <Button
          type="button"
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full font-comfortaaBold bg-primary text-white hover:bg-primary/90 transition-colors duration-300 h-10"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Check Availability
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
