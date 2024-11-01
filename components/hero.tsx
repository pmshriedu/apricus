"use client";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Hotel, Location } from "@/types";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./loading-spinner";
import { BookingModal } from "./booking-modal/booking-modal";

// Interface for form data
interface FormData {
  checkin: string;
  checkout: string;
  adults: number;
  childrens: number;
  location: string;
}

// Interface for SearchForm props
interface SearchFormProps {
  locations: Location[];
  isLoading: boolean;
  handleLocationChange: (value: string) => Promise<void>;
  handleSearch: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
}

// Optimized video background component
const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const maxAttempts = 3;

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Optimize video loading
    video.preload = "auto";
    video.playbackRate = 0.75;

    const handleCanPlay = () => {
      video
        .play()
        .then(() => setIsVideoPlaying(true))
        .catch((error) => {
          console.error("Video playback failed:", error);
          if (loadAttempts < maxAttempts) {
            setLoadAttempts((prev) => prev + 1);
            video.load();
          }
        });
    };

    const handleError = () => {
      if (loadAttempts < maxAttempts) {
        setLoadAttempts((prev) => prev + 1);
        video.load();
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [loadAttempts]);

  return (
    <div className="relative w-full h-full">
      {/* Fallback/Loading State */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 transition-opacity duration-500 ${
          isVideoPlaying ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: "url('/videos/sl-mobile.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isVideoPlaying ? "opacity-100" : "opacity-0"
        }`}
        poster="/images/fallback-bg.jpg"
      >
        <source
          src={isMobile ? "/videos/sl-mobile.gif" : "/videos/sl.mp4"}
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
    </div>
  );
};

// SearchForm component remains the same
const SearchForm: React.FC<SearchFormProps> = ({
  locations,
  isLoading,
  handleLocationChange,
  handleSearch,
  formData,
  setFormData,
}) => (
  <form className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-blur-md p-4 md:p-6 rounded-lg shadow-lg">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-3 md:mb-4">
      <div className="flex flex-col col-span-2 md:col-span-3 lg:col-span-1">
        <Label
          htmlFor="location"
          className="text-white text-sm mb-1 font-comfortaaBold"
        >
          Location
        </Label>
        <Select onValueChange={handleLocationChange} value={formData.location}>
          <SelectTrigger className="bg-white text-black text-sm h-8 md:h-10 font-comfortaaBold text-left">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc: Location) => (
              <SelectItem
                key={loc.id}
                value={loc.id}
                className="font-comfortaaRegular text-left data-[state=checked]:text-primary data-[state=checked]:bg-primary/10 focus:bg-primary/10 focus:text-primary"
              >
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col">
        <Label
          htmlFor="checkin"
          className="text-white text-sm mb-1 font-comfortaaBold"
        >
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
          className="bg-white text-black text-sm h-8 md:h-10 font-comfortaaBold"
          required
        />
      </div>

      <div className="flex flex-col">
        <Label
          htmlFor="checkout"
          className="text-white text-sm mb-1 font-comfortaaBold"
        >
          Check-out
        </Label>
        <Input
          type="date"
          id="checkout"
          value={formData.checkout}
          min={formData.checkin || new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            setFormData({ ...formData, checkout: e.target.value })
          }
          className="bg-white text-black text-sm h-8 md:h-10 font-comfortaaBold"
          required
        />
      </div>

      <div className="flex flex-col">
        <Label
          htmlFor="adults"
          className="text-white text-sm mb-1 font-comfortaaBold"
        >
          Adults
        </Label>
        <Input
          type="number"
          id="adults"
          value={formData.adults}
          onChange={(e) =>
            setFormData({
              ...formData,
              adults: Math.max(1, parseInt(e.target.value)),
            })
          }
          min={1}
          className="bg-white text-black text-sm h-8 md:h-10 font-comfortaaBold"
        />
      </div>

      <div className="flex flex-col">
        <Label
          htmlFor="childrens"
          className="text-white text-sm mb-1 font-comfortaaBold"
        >
          Children
        </Label>
        <Input
          type="number"
          id="childrens"
          value={formData.childrens}
          onChange={(e) =>
            setFormData({
              ...formData,
              childrens: Math.max(0, parseInt(e.target.value)),
            })
          }
          min={0}
          className="bg-white text-black text-sm h-8 md:h-10 font-comfortaaBold"
        />
      </div>
    </div>

    <Button
      type="button"
      onClick={handleSearch}
      disabled={isLoading}
      className="w-full font-comfortaaBold bg-primary text-white hover:bg-gray-100 hover:text-primary transition-colors duration-300 text-sm h-8 md:h-10"
    >
      {isLoading ? <LoadingSpinner /> : "Search Availability"}
    </Button>
  </form>
);

const Hero: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    checkin: "",
    checkout: "",
    adults: 1,
    childrens: 0,
    location: "",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async (): Promise<void> => {
    try {
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
    }
  };

  const handleLocationChange = async (value: string): Promise<void> => {
    setFormData({ ...formData, location: value });
    setIsLoading(true);

    try {
      const response = await fetch(`/api/hotels/${value}`);
      const { success, data, error } = await response.json();

      if (!success) {
        throw new Error(error || "Failed to fetch hotels");
      }

      setHotels(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load hotels",
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
    if (!formData.location) {
      toast({
        title: "Error",
        description: "Please select a location",
        variant: "destructive",
      });
      return;
    }

    if (!formData.checkin || !formData.checkout) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    const dateError = validateDates();
    if (dateError) {
      toast({
        title: "Error",
        description: dateError,
        variant: "destructive",
      });
      return;
    }

    if (formData.adults < 1) {
      toast({
        title: "Error",
        description: "At least one adult is required",
        variant: "destructive",
      });
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <header className="relative h-[500px] overflow-hidden">
      <VideoBackground />

      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-comfortaaBold mb-2 md:mb-4">
          Welcome to Apricus
        </h1>
        <p className="text-sm font-comfortaaRegular md:text-base lg:text-lg mb-4 md:mb-6">
          Experience luxury and comfort in the heart of the city
        </p>

        <SearchForm
          locations={locations}
          isLoading={isLoading}
          handleLocationChange={handleLocationChange}
          handleSearch={handleSearch}
          formData={formData}
          setFormData={setFormData}
        />

        {isModalOpen && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            locationId={formData.location}
            checkIn={formData.checkin}
            checkOut={formData.checkout}
            adults={formData.adults}
            childrens={formData.childrens}
            hotels={hotels}
          />
        )}
      </div>
    </header>
  );
};

export default Hero;
