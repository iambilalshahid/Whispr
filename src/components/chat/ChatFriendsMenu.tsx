import React from "react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Plus, Users } from "lucide-react";
import { Friend } from "@/types/chat";
import { getDisplayName, getInitials } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { chatStore } from "@/stores";

interface ChatFriendsMenuProps {
  filteredFriends?: Friend[];
}

export const ChatFriendsMenu: React.FC<ChatFriendsMenuProps> = observer(
  ({ filteredFriends }) => {
    const friends = filteredFriends ?? chatStore.friends;
    const selectedFriend = chatStore.selectedFriend;
    const onlineUserIds = chatStore.onlineUserIds;
    return (
      <SidebarGroup className="p-3 pt-1 group-data-[collapsible=icon]:p-1">
        <div className="flex items-center justify-between px-1 mb-1.5 group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider p-0 h-auto">
            Chats ({friends.length})
          </SidebarGroupLabel>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => chatStore.setIsAddFriendOpen(true)}
            className="text-[11px] font-medium text-foreground hover:bg-sidebar-accent cursor-pointer flex items-center gap-1 h-auto py-1 px-2 rounded-md"
          >
            <Plus size={12} />
            <span>Add</span>
          </Button>
        </div>

        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {friends.length === 0 ? (
              <div className="py-10 px-2 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
                <Users size={22} className="text-muted-foreground" />
                <p className="group-data-[collapsible=icon]:hidden">
                  No conversations found
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => chatStore.setIsAddFriendOpen(true)}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-primary/10 text-foreground hover:bg-primary/20 border border-primary/20 text-[11px] transition-colors cursor-pointer h-auto group-data-[collapsible=icon]:hidden"
                >
                  Add via Public ID
                </Button>
              </div>
            ) : (
              friends.map((friend) => {
                const isSelected = selectedFriend?.user_id === friend.user_id;
                const isOnline = onlineUserIds.has(friend.user_id);
                const displayName = getDisplayName(friend);
                const initial = getInitials(displayName);

                return (
                  <SidebarMenuItem key={friend.user_id}>
                    <SidebarMenuButton
                      onClick={() => chatStore.setSelectedFriend(friend)}
                      isActive={isSelected}
                      tooltip={displayName}
                      className={`w-full h-auto p-2.5 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-sidebar-accent shadow-xs border border-sidebar-border text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                    >
                      {/* Avatar with Status Indicator */}
                      <div className="relative shrink-0">
                        <div className="size-9 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center font-bold text-xs text-foreground">
                          {initial}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-sidebar ${
                            isOnline
                              ? "bg-success shadow-xs shadow-success/50"
                              : "bg-muted"
                          }`}
                        />
                      </div>

                      {/* Name + Last Message snippet */}
                      <div className="min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground truncate">
                            {displayName}
                          </span>
                          {friend.last_message_time && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {friend.last_message_time}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {friend.last_message || friend.public_id}
                        </p>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }
);

ChatFriendsMenu.displayName = "ChatFriendsMenu";
export default ChatFriendsMenu;
