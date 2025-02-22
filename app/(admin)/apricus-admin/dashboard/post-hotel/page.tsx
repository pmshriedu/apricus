"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useUploadThing } from "@/hooks/use-upload";
type Hotel = {
  id: string;
  name: string;
  description: string | null;
  locationId: string;
  location: {
    id: string;
    name: string;
  };
  createdAt: string;
};

type Location = {
  id: string;
  name: string;
};

export default function HotelManagement() {
  const { toast } = useToast();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { startUpload, isUploading } = useUploadThing("hotelImage");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    locationId: "",
  });

  useEffect(() => {
    fetchHotels();
    fetchLocations();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await fetch("/api/hotel");
      const { success, data } = await response.json();
      if (success) {
        setHotels(data);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch hotels",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations");
      const { success, data } = await response.json();
      if (success) {
        setLocations(data);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch locations",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, upload images if any are selected
      let uploadedImageUrls: string[] = [];
      if (selectedImages.length > 0) {
        const uploadedImages = await startUpload(selectedImages);
        if (!uploadedImages) {
          throw new Error("Failed to upload images");
        }
        uploadedImageUrls = uploadedImages.map((image) => image.url);
      }

      // Create the hotel
      const hotelResponse = await fetch("/api/hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const { success, data: hotel } = await hotelResponse.json();
      if (!success) throw new Error("Failed to create hotel");

      // If we have uploaded images, create the image records
      if (uploadedImageUrls.length > 0) {
        const imageResponse = await fetch("/api/hotel/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hotelId: hotel.id,
            imageUrls: uploadedImageUrls, // Pass array of URL strings
          }),
        });

        if (!imageResponse.ok) {
          throw new Error("Failed to save image records");
        }
      }

      toast({
        title: "Success",
        description: "Hotel added successfully",
      });
      fetchHotels();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: typeof error === "string" ? error : "Failed to add hotel",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;

    try {
      const response = await fetch(`/api/hotel/${selectedHotel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Hotel updated successfully",
        });
        fetchHotels();
        setIsEditDialogOpen(false);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update hotel",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedHotel) return;

    try {
      const response = await fetch(`/api/hotel/${selectedHotel.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Hotel deleted successfully",
        });
        fetchHotels();
        setIsDeleteDialogOpen(false);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete hotel",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      locationId: "",
    });
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const renderForm = (onSubmit: (e: React.FormEvent) => Promise<void>) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Hotel Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="font-comfortaaRegular"
          required
        />
      </div>
      <div>
        <Label htmlFor="images">Hotel Images</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="font-comfortaaRegular"
          disabled={isUploading}
        />
        {isUploading && (
          <p className="text-sm text-muted-foreground mt-2">
            Uploading images...
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="font-comfortaaRegular"
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Select
          value={formData.locationId}
          onValueChange={(value) =>
            setFormData({ ...formData, locationId: value })
          }
          required
        >
          <SelectTrigger className="font-comfortaaRegular">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={handleDialogClose}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditDialogOpen ? "Update Hotel" : "Add Hotel"}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-comfortaaBold text-primary">
            Hotel Management
          </h1>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="font-comfortaaBold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Hotel
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : hotels.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-comfortaaRegular">
              No hotels found. Add your first hotel to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-comfortaaBold">Name</TableHead>
                  <TableHead className="font-comfortaaBold">Location</TableHead>
                  <TableHead className="font-comfortaaBold">
                    Description
                  </TableHead>
                  <TableHead className="font-comfortaaBold">
                    Created At
                  </TableHead>
                  <TableHead className="font-comfortaaBold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="font-comfortaaRegular">
                      {hotel.name}
                    </TableCell>
                    <TableCell className="font-comfortaaRegular">
                      {hotel.location.name}
                    </TableCell>
                    <TableCell className="font-comfortaaRegular">
                      {hotel.description || "-"}
                    </TableCell>
                    <TableCell className="font-comfortaaLight">
                      {new Date(hotel.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedHotel(hotel);
                            setFormData({
                              name: hotel.name,
                              description: hotel.description || "",
                              locationId: hotel.locationId,
                            });
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedHotel(hotel);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Add Hotel Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
            </DialogHeader>
            {renderForm(handleSubmit)}
          </DialogContent>
        </Dialog>

        {/* Edit Hotel Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Hotel</DialogTitle>
            </DialogHeader>
            {renderForm(handleEdit)}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                hotel and all associated bookings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
