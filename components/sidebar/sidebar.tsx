"use client";

import * as React from "react";
import { signOut, useSession } from "next-auth/react";
import {
  BadgeCheck,
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Plus,
  Hotel,
  Calendar,
  Users,
  Home,
  FileQuestion,
  LocateIcon,
  HotelIcon,
  House,
  BedDouble,
  ChartArea,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

const getNavData = () => ({
  teams: [
    {
      name: "Apricus Hotel",
      logo: Hotel,
      plan: "Premium Resort",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/apricus-admin/dashboard",
        },
      ],
    },
    {
      title: "Enquiries",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Enquiry Details",
          url: "/apricus-admin/dashboard/enquiry",
        },
      ],
    },
    {
      title: "Contact Queries",
      url: "#",
      icon: FileQuestion,
      isActive: false,
      items: [
        {
          title: "Queries",
          url: "/apricus-admin/dashboard/contact-enquiry",
        },
      ],
    },
    {
      title: "Bookings",
      url: "#",
      icon: Calendar,
      isActive: false,
      items: [
        {
          title: "Reservations",
          url: "/apricus-admin/dashboard/bookings",
        },
        {
          title: "Booking Status",
          url: "/apricus-admin/dashboard/booking-status",
        },
      ],
    },

    {
      title: "Users",
      url: "#",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "Manage Users",
          url: "/apricus-admin/dashboard/user-management",
        },
        {
          title: "Register User",
          url: "/apricus-admin/dashboard/user-register",
        },
      ],
    },
    {
      title: "Locations",
      url: "#",
      icon: LocateIcon,
      isActive: false,
      items: [
        {
          title: "Add Location",
          url: "/apricus-admin/dashboard/post-location",
        },
      ],
    },
    {
      title: "Hotel",
      url: "#",
      icon: HotelIcon,
      isActive: false,
      items: [
        {
          title: "Add Hotel",
          url: "/apricus-admin/dashboard/post-hotel",
        },
      ],
    },
    {
      title: "Rooms & Amenities",
      url: "#",
      icon: House,
      isActive: false,
      items: [
        {
          title: "Add Rooms",
          url: "/apricus-admin/dashboard/post-room",
        },
        {
          title: "Add Amenities",
          url: "/apricus-admin/dashboard/post-amenities",
        },
        {
          title: "View Room Chart",
          url: "/apricus-admin/dashboard/calender-view",
        },
      ],
    },
    {
      title: "Rooms Inventory",
      url: "#",
      icon: BedDouble,
      isActive: false,
      items: [
        {
          title: "View/Edit Inventory",
          url: "/apricus-admin/dashboard/post-room/inventory",
        },
      ],
    },
    {
      title: "Coupons",
      url: "#",
      icon: HotelIcon,
      isActive: false,
      items: [
        {
          title: "Add Coupons",
          url: "/apricus-admin/dashboard/coupons-post",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: ChartArea,
      isActive: false,
      items: [
        {
          title: "View/Generate Reports",
          url: "/apricus-admin/dashboard/reports",
        },
      ],
    },
  ],
});

export default function ApricusSidebar() {
  const { data: session } = useSession();
  const [activeTeam, setActiveTeam] = React.useState(getNavData().teams[0]);
  const data = getNavData();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
  };
  return (
    <Sidebar
      collapsible="icon"
      className="bg-secondary border-r border-accent/20"
      variant="floating"
    >
      <SidebarHeader className="border-b border-accent/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="font-comfortaaBold hover:bg-accent/10 data-[state=open]:bg-accent/10"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-secondary">
                    <activeTeam.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-comfortaaBold">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs font-comfortaaRegular text-accent">
                      {activeTeam.plan}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto text-primary" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-secondary"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs font-comfortaaMedium text-accent">
                  Properties
                </DropdownMenuLabel>
                {data.teams.map((team, index) => (
                  <DropdownMenuItem
                    key={team.name}
                    onClick={() => setActiveTeam(team)}
                    className="gap-2 p-2 hover:bg-accent/10"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border border-primary">
                      <team.logo className="size-4 shrink-0 text-primary" />
                    </div>
                    <span className="font-comfortaaRegular text-primary">
                      {team.name}
                    </span>
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-accent/20" />
                <DropdownMenuItem className="gap-2 p-2 hover:bg-accent/10">
                  <div className="flex size-6 items-center justify-center rounded-md border border-primary bg-secondary">
                    <Plus className="size-4 text-primary" />
                  </div>
                  <div className="font-comfortaaMedium text-primary">
                    Add Property
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-comfortaaBold">
            Hotel Management
          </SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="hover:bg-accent/10 font-comfortaaRegular"
                    >
                      {item.icon && <item.icon className="" />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-primary" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="hover:bg-accent/10 font-comfortaaLight"
                          >
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-accent/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="font-comfortaaBold hover:bg-accent/10 data-[state=open]:bg-accent/10"
                >
                  <Avatar className="h-8 w-8 border-2 border-accent">
                    <AvatarImage
                      src={session?.user?.image || ""}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary text-secondary">
                      {(session?.user?.name || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-comfortaaBold">
                      {session?.user?.name || "User"}
                    </span>
                    <span className="truncate text-xs font-comfortaaRegular text-accent">
                      {session?.user?.email || "user@apricus.com"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto text-primary" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-secondary"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="font-comfortaaBold">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-accent/20" />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="font-comfortaaRegular hover:bg-accent/10"
                    onClick={() =>
                      router.push("/apricus-admin/dashboard/admin-profile")
                    }
                  >
                    <BadgeCheck className="mr-2 text-primary" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-accent/20" />
                <DropdownMenuItem
                  className="font-comfortaaMedium text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
