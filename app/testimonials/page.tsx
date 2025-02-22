"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  MapPin,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Hotel {
  id: string;
  name: string;
  location: {
    name: string;
  };
  _count: {
    Testimonial: number;
  };
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  hotel: {
    name: string;
  };
  review: string;
}

interface TestimonialsResponse {
  testimonials: Testimonial[];
  total: number;
  totalPages: number;
}

interface FormData {
  name: string;
  location: string;
  hotelId: string;
  review: string;
}

const ITEMS_PER_PAGE = 4;
const MIN_REVIEW_LENGTH = 20;
const MAX_REVIEW_LENGTH = 500;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

const TestimonialsPage = () => {
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    hotelId: "",
    review: "",
  });

  // Fetch hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/testimonials/hotel");
        if (!response.ok) throw new Error("Failed to fetch hotels");
        const data = await response.json();
        setHotels(data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch hotels. Please try again later.",
          variant: "destructive",
        });
      }
    };
    fetchHotels();
  }, []);

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/testimonials?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
        );
        if (!response.ok) throw new Error("Failed to fetch testimonials");
        const data: TestimonialsResponse = await response.json();
        setTestimonials(data.testimonials);
        setTotalPages(data.totalPages);
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch testimonials. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, [currentPage]);

  const validateForm = (): boolean => {
    if (
      formData.name.length < MIN_NAME_LENGTH ||
      formData.name.length > MAX_NAME_LENGTH
    ) {
      toast({
        title: "Invalid Name",
        description: `Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`,
        variant: "destructive",
      });
      return false;
    }

    if (
      formData.review.length < MIN_REVIEW_LENGTH ||
      formData.review.length > MAX_REVIEW_LENGTH
    ) {
      toast({
        title: "Invalid Review",
        description: `Review must be between ${MIN_REVIEW_LENGTH} and ${MAX_REVIEW_LENGTH} characters`,
        variant: "destructive",
      });
      return false;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.hotelId) {
      toast({
        title: "Hotel Required",
        description: "Please select a hotel",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rating,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit review");
      }

      toast({
        title: "Success",
        description: "Thank you for your review!",
      });

      // Reset form
      setFormData({
        name: "",
        location: "",
        hotelId: "",
        review: "",
      });
      setRating(0);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="font-comfortaaRegular">
      {/* Hero Section */}
      <section className="relative min-h-[300px] md:min-h-[400px] flex items-center justify-center bg-primary">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center bg-no-repeat opacity-20" />
        <div className="relative z-20 text-white text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center mb-4 md:mb-6 bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            <span className="font-comfortaaMedium uppercase tracking-wider text-xs md:text-sm">
              Guest Stories
            </span>
          </div>
          <h1 className="font-comfortaaBold text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6">
            Our Guest Experiences
          </h1>
          <p className="font-comfortaaLight text-lg md:text-xl max-w-2xl mx-auto px-4">
            Discover what makes Apricus Hotels extraordinary through the eyes of
            our guests
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <Tabs defaultValue="read" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="read">Read Reviews</TabsTrigger>
            <TabsTrigger value="write">Write a Review</TabsTrigger>
          </TabsList>

          <TabsContent value="read" className="space-y-8">
            {loading ? (
              <div className="text-center py-8">Loading testimonials...</div>
            ) : testimonials.length === 0 ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-comfortaaBold text-gray-700 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-500 text-center mb-4">
                    Be the first to share your experience!
                  </p>
                  <Button
                    onClick={() =>
                      (
                        document.querySelector('[value="write"]') as HTMLElement
                      )?.click()
                    }
                    variant="outline"
                  >
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div className="space-y-1">
                            <h3 className="font-comfortaaBold text-base md:text-lg line-clamp-1">
                              {testimonial.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 space-x-2">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {testimonial.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-shrink-0">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 text-yellow-400 fill-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Building2 className="w-4 h-4 flex-shrink-0" />
                          <span className="line-clamp-4">
                            {testimonial.hotel.name}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm md:text-base line-clamp-none break-all">
                          {testimonial.review}
                        </p>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          {new Date(testimonial.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {testimonials.length > 0 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                  className="text-sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || loading}
                  className="text-sm"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="write">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-comfortaaBold">
                  Share Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-comfortaaMedium text-sm">
                        Your Name
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                        maxLength={MAX_NAME_LENGTH}
                      />
                      <p className="text-xs text-gray-500">
                        {formData.name.length}/{MAX_NAME_LENGTH} characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-comfortaaMedium text-sm">
                        Location
                      </label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-comfortaaMedium text-sm">
                      Select Hotel
                    </label>
                    <Select
                      name="hotelId"
                      value={formData.hotelId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, hotelId: value }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a hotel" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotels.map((hotel) => (
                          <SelectItem key={hotel.id} value={hotel.id}>
                            {hotel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-comfortaaMedium text-sm">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 cursor-pointer transition-colors hover:scale-110 ${
                            star <= rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {rating === 0
                        ? "Select your rating"
                        : `${rating} star${rating !== 1 ? "s" : ""} selected`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-comfortaaMedium text-sm">
                      Your Review
                    </label>
                    <Textarea
                      name="review"
                      value={formData.review}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      maxLength={MAX_REVIEW_LENGTH}
                      placeholder="Tell us about your experience... (minimum 20 characters)"
                      className="resize-none"
                    />
                    <p
                      className={`text-xs ${
                        formData.review.length < MIN_REVIEW_LENGTH
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {formData.review.length}/{MAX_REVIEW_LENGTH} characters
                      {formData.review.length < MIN_REVIEW_LENGTH &&
                        ` (${
                          MIN_REVIEW_LENGTH - formData.review.length
                        } more required)`}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-white hover:bg-primary/90 transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2">◌</span>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestimonialsPage;
