import React from "react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarBadge } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDisplayName, getInitials } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { chatStore } from "@/stores";

export const FriendProfileSidebar: React.FC = observer(() => {
  const friend = chatStore.selectedFriend;
  const isOnline = chatStore.isSelectedFriendOnline;
    if (!friend) return null;

    const displayName = getDisplayName(friend);
    const initial = getInitials(displayName);

    return (
      <aside className="w-[280px] bg-sidebar/50 backdrop-blur-md border-l border-sidebar-border flex flex-col shrink-0 overflow-y-auto select-none">
        {/* Date header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
          <span>
            {new Date().toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Bell size={14} className="text-zinc-400 hover:text-white cursor-pointer" />
        </div>

        {/* Profile Card */}
        <div className="p-6 flex flex-col items-center text-center">
          <Avatar className="size-20 ring-2 ring-sidebar-border mb-3">
            <AvatarFallback className="bg-sidebar-accent border border-sidebar-border text-sidebar-accent-foreground text-2xl font-bold shadow-inner">
              {initial}
            </AvatarFallback>
            {isOnline && (
              <AvatarBadge className="size-3.5 bg-emerald-500 ring-2 ring-[#14171d]" />
            )}
          </Avatar>

          <h4 className="font-bold text-sm text-white">{displayName}</h4>
          <p className="text-xs text-zinc-400 mt-0.5">{friend.email}</p>
          <Badge
            variant="outline"
            className="mt-2 font-mono text-emerald-400 border-white/10 bg-white/[0.04]"
          >
            {friend.public_id}
          </Badge>
        </div>

        <Separator className="bg-white/[0.06]" />

        {/* Info Card */}
        <div className="p-5 space-y-4">
          <Card className="bg-[#1c2028] border-white/[0.06] rounded-2xl shadow-none">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Connection Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Status</span>
                <Badge
                  variant={isOnline ? "default" : "secondary"}
                  className={
                    isOnline
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]"
                      : "text-[10px]"
                  }
                >
                  {isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Mode</span>
                <span className="text-zinc-200">Supabase Realtime</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Chat Type</span>
                <span className="text-zinc-200">Direct Message</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>
    );
  }
);

FriendProfileSidebar.displayName = "FriendProfileSidebar";
