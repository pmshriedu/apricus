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
import { Checkbox } from "@/components/ui/checkbox";
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

type Room = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  capacity: number;
  images: { id: string; url: string }[];
  amenities: Amenity[];
  createdAt: string;
};

type Amenity = {
  id: string;
  name: string;
  icon?: string;
};

type Hotel = {
  id: string;
  name: string;
};

export default function RoomManagement() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const { startUpload, isUploading } = useUploadThing("roomImage");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    amenityIds: [] as string[],
  });

  useEffect(() => {
    fetchHotels();
    fetchAmenities();
  }, []);

  useEffect(() => {
    if (selectedHotelId) {
      fetchRooms();
    }
  }, [selectedHotelId]);

  const fetchHotels = async () => {
    try {
      const response = await fetch(`/api/hotel`);
      const { success, data } = await response.json();
      if (success) {
        setHotels(data);
        if (data.length > 0) {
          setSelectedHotelId(data[0].id);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hotels",
        variant: "destructive",
      });
      console.error("Failed to fetch hotels:", error);
    }
  };

  const fetchRooms = async () => {
    if (!selectedHotelId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/hotel/${selectedHotelId}/rooms`);
      const { success, data } = await response.json();
      if (success) {
        setRooms(data);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAmenities = async () => {
    try {
      const response = await fetch("/api/amenities");
      const { success, data } = await response.json();
      if (success) {
        setAmenities(data);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch amenities",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelId) {
      toast({
        title: "Error",
        description: "Please select a hotel first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let uploadedImageUrls: string[] = [];
      if (selectedImages.length > 0) {
        const uploadedImages = await startUpload(selectedImages);
        if (!uploadedImages) {
          throw new Error("Failed to upload images");
        }
        uploadedImageUrls = uploadedImages.map((image) => image.url);
      }

      const response = await fetch(`/api/hotel/${selectedHotelId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          imageUrls: uploadedImageUrls,
        }),
      });

      const { success } = await response.json();
      if (!success) throw new Error("Failed to create room");

      toast({
        title: "Success",
        description: "Room added successfully",
      });
      fetchRooms();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: typeof error === "string" ? error : "Failed to add room",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !selectedHotelId) return;

    try {
      const response = await fetch(
        `/api/hotel/${selectedHotelId}/rooms/${selectedRoom.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            capacity: parseInt(formData.capacity),
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Room updated successfully",
        });
        fetchRooms();
        setIsEditDialogOpen(false);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update room",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedRoom || !selectedHotelId) return;

    try {
      const response = await fetch(
        `/api/hotel/${selectedHotelId}/rooms/${selectedRoom.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Room deleted successfully",
        });
        fetchRooms();
        setIsDeleteDialogOpen(false);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      capacity: "",
      amenityIds: [],
    });
    setSelectedImages([]);
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const renderForm = (onSubmit: (e: React.FormEvent) => Promise<void>) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="images">Room Images</Label>
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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="font-comfortaaRegular"
          required
        />
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
        <Label htmlFor="price">Price per Night</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="font-comfortaaRegular"
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          type="number"
          value={formData.capacity}
          onChange={(e) =>
            setFormData({ ...formData, capacity: e.target.value })
          }
          className="font-comfortaaRegular"
          required
          min="1"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amenities">Amenities</Label>
        <div className="grid grid-cols-2 gap-4">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity.id}`}
                checked={formData.amenityIds.includes(amenity.id)}
                onCheckedChange={(checked: boolean) => {
                  setFormData({
                    ...formData,
                    amenityIds: checked
                      ? [...formData.amenityIds, amenity.id]
                      : formData.amenityIds.filter((id) => id !== amenity.id),
                  });
                }}
              />
              <Label
                htmlFor={`amenity-${amenity.id}`}
                className="font-comfortaaRegular"
              >
                {amenity.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={handleDialogClose}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditDialogOpen ? "Update Room" : "Add Room"}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-comfortaaBold text-primary">
            Room Management
          </h2>
          <div className="flex gap-4">
            <div className="w-64">
              <Select
                value={selectedHotelId}
                onValueChange={setSelectedHotelId}
                disabled={hotels.length === 0}
              >
                <SelectTrigger className="font-comfortaaRegular">
                  <SelectValue placeholder="Select a hotel" />
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
            <Button
              onClick={() => {
                if (!selectedHotelId) {
                  toast({
                    title: "Error",
                    description: "Please select a hotel first",
                    variant: "destructive",
                  });
                  return;
                }
                setIsAddDialogOpen(true);
              }}
              className="font-comfortaaBold"
              disabled={!selectedHotelId}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {!selectedHotelId ? (
            <div className="p-8 text-center text-gray-500 font-comfortaaRegular">
              Please select a hotel to view its rooms
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : rooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-comfortaaRegular">
              No rooms found. Add your first room to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-comfortaaBold">Name</TableHead>
                  <TableHead className="font-comfortaaBold">Price</TableHead>
                  <TableHead className="font-comfortaaBold">Capacity</TableHead>
                  <TableHead className="font-comfortaaBold">
                    Amenities
                  </TableHead>
                  <TableHead className="font-comfortaaBold">
                    Created At
                  </TableHead>
                  <TableHead className="font-comfortaaBold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-comfortaaRegular">
                      {room.name}
                    </TableCell>
                    <TableCell className="font-comfortaaRegular">
                      ${room.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-comfortaaRegular">
                      {room.capacity}
                    </TableCell>
                    <TableCell className="font-comfortaaRegular">
                      {room.amenities.map((a) => a.name).join(", ") || "-"}
                    </TableCell>
                    <TableCell className="font-comfortaaLight">
                      {new Date(room.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRoom(room);
                            setFormData({
                              name: room.name,
                              description: room.description || "",
                              price: room.price.toString(),
                              capacity: room.capacity.toString(),
                              amenityIds: room.amenities.map((a) => a.id),
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
                            setSelectedRoom(room);
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

        {/* Add Room Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            {renderForm(handleSubmit)}
          </DialogContent>
        </Dialog>

        {/* Edit Room Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
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
                room and all associated bookings.
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
