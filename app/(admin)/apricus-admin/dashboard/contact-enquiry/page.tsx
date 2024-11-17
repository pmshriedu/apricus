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
import { Trash2, Loader2, Eye } from "lucide-react";
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
} from "@/components/ui/dialog";

type Contact = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function ContactQueries() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contact");
      const result = await response.json();
      setContacts(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/contact/${deleteId}`, { method: "DELETE" });
      setContacts(contacts.filter((contact) => contact.id !== deleteId));
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const openDetailModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = contacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-full max-w-full mx-auto">
        <h1 className="font-comfortaaBold text-2xl md:text-3xl text-primary mb-6">
          Contact Queries
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : contacts.length === 0 ? (
          <p className="text-left font-comfortaaRegular text-gray-600">
            No contact queries found.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-comfortaaBold">Name</TableHead>
                    <TableHead className="font-comfortaaBold hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="font-comfortaaBold hidden md:table-cell">
                      Message
                    </TableHead>
                    <TableHead className="font-comfortaaBold hidden md:table-cell">
                      Date
                    </TableHead>
                    <TableHead className="font-comfortaaBold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-comfortaaRegular">
                        {contact.name}
                      </TableCell>
                      <TableCell className="font-comfortaaRegular hidden md:table-cell">
                        {contact.email}
                      </TableCell>
                      <TableCell className="font-comfortaaRegular hidden md:table-cell">
                        {contact.message.length > 50
                          ? `${contact.message.substring(0, 50)}...`
                          : contact.message}
                      </TableCell>
                      <TableCell className="font-comfortaaLight text-sm text-gray-500 hidden md:table-cell">
                        {new Date(contact.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailModal(contact)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(contact.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {contacts.length > itemsPerPage && (
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
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this contact?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contact query.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteContact}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {selectedContact && (
              <div className="space-y-4">
                <p>
                  <strong>Name:</strong> {selectedContact.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedContact.email}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </p>
                <div>
                  <strong>Message:</strong>
                  <p className="mt-2 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
