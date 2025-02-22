// types/testimonial.ts
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: Date;
  hotelId: string;
  review: string;
  createdAt: Date;
  updatedAt: Date;
  hotel: {
    name: string;
  };
}

export interface TestimonialsResponse {
  testimonials: Testimonial[];
  total: number;
  totalPages: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: {
    name: string;
  };
  _count: {
    testimonials: number;
  };
}
