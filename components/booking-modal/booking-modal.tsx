// components/BookingModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Hotel } from "@/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrens: number;
  hotels: Hotel[];
}

export function BookingModal({
  isOpen,
  onClose,
  locationId,
  checkIn,
  checkOut,
  adults,
  childrens,
  hotels,
}: BookingModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNo: "",
    email: "",
    selectedHotel: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof e === "string" ? e : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          hotelId: formData.selectedHotel,
          checkIn,
          checkOut,
          adults,
          childrens,
          fullName: formData.fullName,
          phoneNo: formData.phoneNo,
          email: formData.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create booking");
      }

      toast({
        title: "Query Submitted",
        description: "We've received your request and will update you soon.",
        variant: "default",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Booking Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-comfortaaBold text-xl">
            Complete Your Booking
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="hotel" className="font-comfortaaBold">
              Select Hotel
            </Label>
            <Select
              onValueChange={(value) => handleChange("selectedHotel")(value)}
              value={formData.selectedHotel}
            >
              <SelectTrigger className="font-comfortaaRegular text-left">
                <SelectValue placeholder="Choose a hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((hotel) => (
                  <SelectItem
                    key={hotel.id}
                    value={hotel.id}
                    className="font-comfortaaRegular text-left data-[state=checked]:text-primary data-[state=checked]:bg-primary/10 focus:bg-primary/10 focus:text-primary"
                  >
                    {hotel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="fullName" className="font-comfortaaBold">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={handleChange("fullName")}
              className="font-comfortaaRegular"
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNo" className="font-comfortaaBold">
              Phone Number
            </Label>
            <Input
              id="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange("phoneNo")}
              className="font-comfortaaRegular"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="font-comfortaaBold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              className="font-comfortaaRegular"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full font-comfortaaBold bg-primary text-white hover:bg-gray-100 hover:text-primary transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
