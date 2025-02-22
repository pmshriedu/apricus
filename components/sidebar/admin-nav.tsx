import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

const ApricusNav = () => {
  return (
    <header className="flex  items-center  justify-between ">
      <div className="flex items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>
      <div className="flex items-center  space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full hover:bg-accent/10"
            >
              <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarImage src="/api/placeholder/32/32" alt="User" />
                <AvatarFallback className="bg-accent text-secondary font-comfortaaMedium">
                  A
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-secondary">
            <DropdownMenuLabel className="font-comfortaaBold text-primary">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-accent/20" />
            <DropdownMenuItem className="font-comfortaaRegular hover:bg-accent/10">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="font-comfortaaRegular hover:bg-accent/10">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-accent/20" />
            <DropdownMenuItem className="font-comfortaaMedium text-red-600 hover:bg-red-50">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ApricusNav;
