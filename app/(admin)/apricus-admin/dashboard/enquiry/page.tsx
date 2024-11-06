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
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Eye, Edit2, ChevronDown } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Enquiry = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
};

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch("/api/enquiries");
      const data = await response.json();
      setEnquiries(data.data);
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRowExpansion = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const deleteEnquiry = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/enquiries/${deleteId}`, { method: "DELETE" });
      setEnquiries(enquiries.filter((enquiry) => enquiry.id !== deleteId));
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete enquiry:", error);
    }
  };

  const updateEnquiryStatus = async () => {
    if (!selectedEnquiry) return;
    try {
      const response = await fetch(`/api/enquiries/${selectedEnquiry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: editStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setEnquiries(
        enquiries.map((enquiry) =>
          enquiry.id === selectedEnquiry.id
            ? { ...enquiry, status: editStatus as Enquiry["status"] }
            : enquiry
        )
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update enquiry:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
    };
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const openDetailModal = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDetailModalOpen(true);
  };

  const openEditModal = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setEditStatus(enquiry.status);
    setIsEditModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnquiries = enquiries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(enquiries.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-full max-w-full mx-auto">
        <h1 className="font-comfortaaBold text-2xl md:text-3xl text-primary mb-6">
          Manage Enquiries
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : enquiries.length === 0 ? (
          <p className="text-left font-comfortaaRegular text-gray-600">
            No enquiries found.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-comfortaaBold"></TableHead>
                    <TableHead className="font-comfortaaBold">Name</TableHead>
                    <TableHead className="font-comfortaaBold hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="font-comfortaaBold hidden lg:table-cell">
                      Phone
                    </TableHead>
                    <TableHead className="font-comfortaaBold">Status</TableHead>
                    <TableHead className="font-comfortaaBold hidden lg:table-cell">
                      Date
                    </TableHead>
                    <TableHead className="font-comfortaaBold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEnquiries.map((enquiry) => (
                    <React.Fragment key={enquiry.id}>
                      <TableRow>
                        <TableCell className="w-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 hover:bg-transparent"
                            onClick={() => toggleRowExpansion(enquiry.id)}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedRows.has(enquiry.id) ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </TableCell>
                        <TableCell className="font-comfortaaRegular">
                          {enquiry.fullName}
                        </TableCell>
                        <TableCell className="font-comfortaaRegular hidden md:table-cell">
                          {enquiry.email}
                        </TableCell>
                        <TableCell className="font-comfortaaRegular hidden lg:table-cell">
                          {enquiry.phoneNumber}
                        </TableCell>
                        <TableCell className="font-comfortaaRegular">
                          {getStatusBadge(enquiry.status)}
                        </TableCell>
                        <TableCell className="font-comfortaaLight text-sm text-gray-500 hidden lg:table-cell">
                          {new Date(enquiry.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetailModal(enquiry)}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(enquiry)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteDialog(enquiry.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(enquiry.id) && (
                        <TableRow className="bg-gray-50 md:hidden">
                          <TableCell colSpan={7}>
                            <div className="px-4 py-2 space-y-2">
                              <p>
                                <span className="font-medium">Email:</span>{" "}
                                {enquiry.email}
                              </p>
                              <p>
                                <span className="font-medium">Phone:</span>{" "}
                                {enquiry.phoneNumber}
                              </p>
                              <p>
                                <span className="font-medium">Created:</span>{" "}
                                {new Date(enquiry.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
            {enquiries.length > itemsPerPage && (
              <div className="flex justify-start items-center space-x-2 mt-4">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="font-comfortaaRegular"
                >
                  Previous
                </Button>
                <span className="font-comfortaaRegular">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="font-comfortaaRegular"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this enquiry?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              enquiry record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteEnquiry}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {selectedEnquiry && (
              <div className="space-y-4">
                <p>
                  <strong>Name:</strong> {selectedEnquiry.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedEnquiry.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedEnquiry.phoneNumber}
                </p>
                <p>
                  <strong>Status:</strong> {selectedEnquiry.status}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(selectedEnquiry.updatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Edit Status Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Enquiry Status</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={editStatus} onValueChange={setEditStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateEnquiryStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
