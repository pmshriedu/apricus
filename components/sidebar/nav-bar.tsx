"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../ui/sidebar";
import { Separator } from "../ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "../ui/breadcrumb";

import { LogOut, MoreHorizontal, type LucideIcon, User } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const NavTop = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/");
  };

  const data = {
    actions: [
      [
        {
          label: "Profile",
          icon: User,
          onClick: () => router.push("/apricus-admin/dashboard/admin-profile"),
        },
      ],

      [
        {
          label: "Logout",
          icon: LogOut,
          onClick: handleLogout,
        },
      ],
    ],
  };

  return (
    <>
      <header className=" flex h-14 shrink-0 items-center gap-2 bg-white">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 font-comfortaaBold text-primary">
                  Apricus Administrator
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-3">
          <NavActions actions={data.actions} />
        </div>
      </header>
    </>
  );
};

export default NavTop;

function NavActions({
  actions,
}: {
  actions: {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
  }[][];
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = React.useState<string>("");

  React.useEffect(() => {
    setIsOpen(false);
    // Format current date
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="hidden font-comfortaaRegular text-muted-foreground md:inline-block">
        {currentDate}
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-accent"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <div className="bg-white px-4 py-2">
            <p className="font-comfortaaMedium text-primary">
              {session?.user?.name || "User"}
            </p>
          </div>
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {actions.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton
                            onClick={item.onClick}
                            className="hover:bg-accent hover:text-white"
                          >
                            <item.icon /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
