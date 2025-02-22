import NavTop from "@/components/sidebar/nav-bar";
import ApricusSidebar from "@/components/sidebar/sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ApricusSidebar />
      <SidebarInset>
        <main>
          <NavTop />

          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
