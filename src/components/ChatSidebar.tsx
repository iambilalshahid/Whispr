import React from "react";
import InputField from "@/components/CustomFields/InputField";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogOut, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import InnerSidebarHeader from "./InnerSidebarHeader";
import OnlineFriendsList from "./chat/OnlineFriendsList";
import ChatFriendsMenu from "./chat/ChatFriendsMenu";
import { observer } from "mobx-react-lite";
import { chatStore } from "@/stores";
import { handleSignOut } from "@/lib/auth";

export const ChatSidebar: React.FC = observer(() => {
  const searchForm = useForm<{ query: string }>({
    defaultValues: { query: "" },
  });

  const searchQuery = searchForm.watch("query") || "";

  const filteredFriends = React.useMemo(() => {
    if (!searchQuery.trim()) return chatStore.friends;
    const q = searchQuery.toLowerCase();
    return chatStore.friends.filter(
      (f) =>
        f.first_name.toLowerCase().includes(q) ||
        f.last_name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.public_id.toLowerCase().includes(q)
    );
  }, [chatStore.friends, searchQuery]);

  return (
    <Sidebar
      variant="sidebar"
      collapsible="none"
      className="border-r border-sidebar-border bg-sidebar/50 backdrop-blur-md text-sidebar-foreground flex flex-col shrink-0 select-none"
    >
      {/* 1. Sidebar Header: User Profile with Copyable Public ID & Lattice Loader */}
      <InnerSidebarHeader />

      <SidebarContent className="p-0 gap-0 no-scrollbar overflow-y-auto">
        {/* 2. Friends Online Horizontal Carousel */}
        <OnlineFriendsList />

        {/* 3. Search Chat using CustomFields InputField */}
        <div className="px-4 py-2 group-data-[collapsible=icon]:hidden">
          <InputField<{ query: string }>
            form={searchForm}
            name="query"
            placeholder="Search chat or friend..."
            Icon={Search}
            isLabelDisabled={true}
            onClear={() => searchForm.setValue("query", "")}
          />
        </div>

        {/* 4. Chats List Section using SidebarMenu */}
        <ChatFriendsMenu filteredFriends={filteredFriends} />
      </SidebarContent>

      {/* 5. Sidebar Footer: SidebarTrigger and Sign Out */}
      <SidebarFooter className="p-2.5 border-t border-sidebar-border flex flex-row items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-lg cursor-pointer" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleSignOut()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer h-auto group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center"
          title="Sign Out"
        >
          <LogOut size={13} />
          <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
);

ChatSidebar.displayName = "ChatSidebar";

export default ChatSidebar;
