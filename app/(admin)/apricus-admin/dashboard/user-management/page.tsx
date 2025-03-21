"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import {
  Search,
  MoreHorizontal,
  Trash,
  Filter,
  RefreshCw,
  ChevronDown,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  bookingsCount: number;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteUser, setDeleteUser] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const router = useRouter();

  const allRoles = ["ADMIN", "CUSTOMER"];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users, selectedRoles, sortConfig]);

  const filterUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (selectedRoles.length > 0) {
      filtered = filtered.filter((user) => selectedRoles.includes(user.role));
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof User];
        const bValue = b[sortConfig.key as keyof User];

        // Handle null/undefined values
        if (aValue === null || aValue === undefined)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (bValue === null || bValue === undefined)
          return sortConfig.direction === "ascending" ? 1 : -1;

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredUsers(filtered);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;

    try {
      const response = await fetch(`/api/users/${deleteUser}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove user from state
      const updatedUsers = users.filter((user) => user.id !== deleteUser);
      setUsers(updatedUsers);
      filterUsers();
      setDeleteDialogOpen(false);
      setDeleteUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return format(new Date(dateString), "MMM dd, yyyy h:mm a");
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-blue-500 font-comfortaaRegular">Admin</Badge>
        );
      case "CUSTOMER":
        return (
          <Badge className="bg-green-500 font-comfortaaRegular">Customer</Badge>
        );
      default:
        return <Badge className="font-comfortaaRegular">{role}</Badge>;
    }
  };

  const toggleRoleFilter = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRoles([]);
    setSortConfig(null);
  };

  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-comfortaaBold text-primary">
                User Management
              </CardTitle>
              <CardDescription className="font-comfortaaRegular">
                Manage user accounts and view their booking activity
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="font-comfortaaRegular flex items-center gap-2"
                onClick={() => fetchUsers()}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              {/* <Button
                className="font-comfortaaRegular flex items-center gap-2 bg-primary"
                onClick={() => router.push("/admin/users/add")}
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Add User</span>
              </Button> */}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8 font-comfortaaRegular"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="font-comfortaaRegular">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-comfortaaMedium">
                  User Role
                </DropdownMenuLabel>
                {allRoles.map((role) => (
                  <DropdownMenuCheckboxItem
                    key={role}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => toggleRoleFilter(role)}
                    className="font-comfortaaRegular"
                  >
                    {role === "ADMIN" ? "Admin" : "Customer"}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-comfortaaRegular cursor-pointer"
                  onClick={clearFilters}
                >
                  Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Select onValueChange={(value) => setItemsPerPage(parseInt(value))}>
              <SelectTrigger className="w-full sm:w-36 font-comfortaaRegular">
                <SelectValue placeholder={`${itemsPerPage} per page`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5" className="font-comfortaaRegular">
                  5 per page
                </SelectItem>
                <SelectItem value="10" className="font-comfortaaRegular">
                  10 per page
                </SelectItem>
                <SelectItem value="25" className="font-comfortaaRegular">
                  25 per page
                </SelectItem>
                <SelectItem value="50" className="font-comfortaaRegular">
                  50 per page
                </SelectItem>
              </SelectContent>
            </Select>

            {/* <Button
              variant="outline"
              className="ml-auto hidden sm:flex font-comfortaaRegular"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button> */}
          </div>

          {selectedRoles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedRoles.map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="font-comfortaaRegular flex items-center gap-1 cursor-pointer"
                  onClick={() => toggleRoleFilter(role)}
                >
                  {role}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 font-comfortaaRegular text-xs"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground font-comfortaaRegular">
              Loading users...
            </p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead
                      className="font-comfortaaBold cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        User
                        {sortConfig?.key === "name" && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              sortConfig.direction === "descending"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-comfortaaBold cursor-pointer"
                      onClick={() => handleSort("role")}
                    >
                      <div className="flex items-center gap-1">
                        Role
                        {sortConfig?.key === "role" && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              sortConfig.direction === "descending"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-comfortaaBold cursor-pointer"
                      onClick={() => handleSort("bookingsCount")}
                    >
                      <div className="flex items-center gap-1">
                        Bookings
                        {sortConfig?.key === "bookingsCount" && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              sortConfig.direction === "descending"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-comfortaaBold cursor-pointer hidden md:table-cell"
                      onClick={() => handleSort("lastLogin")}
                    >
                      <div className="flex items-center gap-1">
                        Last Login
                        {sortConfig?.key === "lastLogin" && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              sortConfig.direction === "descending"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-comfortaaBold cursor-pointer hidden md:table-cell"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">
                        Joined
                        {sortConfig?.key === "createdAt" && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              sortConfig.direction === "descending"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-comfortaaBold w-14"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-comfortaaMedium">
                              {user.name || "No Name"}
                            </span>
                            <span className="text-sm text-muted-foreground font-comfortaaLight">
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="font-comfortaaMedium">
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="bg-primary/10">
                              {user.bookingsCount}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-comfortaaRegular text-sm hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(user.lastLogin)}
                          </div>
                        </TableCell>
                        <TableCell className="font-comfortaaRegular text-sm hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* <DropdownMenuItem
                                className="font-comfortaaRegular cursor-pointer"
                                onClick={() =>
                                  router.push(`/admin/users/${user.id}`)
                                }
                              >
                                <UserCog className="h-4 w-4 mr-2" />
                                <span>Edit User</span>
                              </DropdownMenuItem> */}
                              <DropdownMenuItem
                                className="font-comfortaaRegular cursor-pointer"
                                onClick={() =>
                                  router.push(
                                    `/apricus-admin/dashboard/bookings`
                                  )
                                }
                              >
                                <Calendar className="h-4 w-4 mr-2 text-primary" />
                                <span className="text-primary font-comfortaaMedium">
                                  View Bookings
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="font-comfortaaRegular cursor-pointer text-destructive focus:text-destructive"
                                onClick={() => {
                                  setDeleteUser(user.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center font-comfortaaRegular"
                      >
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent className="flex flex-wrap">
                <PaginationItem>
                  <PaginationPrevious
                    className="font-comfortaaRegular"
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    aria-disabled={currentPage === 1}
                    tabIndex={currentPage === 1 ? -1 : 0}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }).map(
                  (_, index) => {
                    let pageNumber;

                    // Logic to show ellipsis for many pages
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                      if (index === 4)
                        return (
                          <PaginationItem key={index}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                      if (index === 0)
                        return (
                          <PaginationItem key={index}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                    } else {
                      if (index === 0)
                        return (
                          <PaginationItem key={index}>
                            <PaginationLink
                              onClick={() => paginate(1)}
                              className="font-comfortaaRegular"
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                        );
                      if (index === 1)
                        return (
                          <PaginationItem key={index}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      if (index === 3)
                        return (
                          <PaginationItem key={index}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      if (index === 4)
                        return (
                          <PaginationItem key={index}>
                            <PaginationLink
                              onClick={() => paginate(totalPages)}
                              className="font-comfortaaRegular"
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      pageNumber = currentPage + index - 2;
                    }

                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          isActive={currentPage === pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className="font-comfortaaRegular"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                <PaginationItem>
                  <PaginationNext
                    className="font-comfortaaRegular"
                    onClick={() =>
                      currentPage < totalPages && paginate(currentPage + 1)
                    }
                    aria-disabled={currentPage === totalPages}
                    tabIndex={currentPage === totalPages ? -1 : 0}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-comfortaaBold text-primary">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="font-comfortaaRegular">
              Are you sure you want to delete this user? This action cannot be
              undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-comfortaaRegular">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-comfortaaRegular"
              onClick={handleDeleteUser}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
