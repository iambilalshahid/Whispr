import React from "react";
import { Button } from "@/components/ui/button";
import { getDisplayName, getInitials } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { chatStore } from "@/stores";

export const OnlineFriendsList: React.FC = observer(() => {
  const onlineFriends = chatStore.onlineFriends;
  return (
    <div className="px-4 pt-3.5 pb-2 group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
          Friends Online
        </span>
        <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
          {onlineFriends.length}
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {onlineFriends.length === 0 ? (
          <p className="text-[11px] text-muted-foreground py-1">No friends online</p>
        ) : (
          onlineFriends.map((f) => {
            const name = getDisplayName(f);
            const initial = getInitials(name);
            return (
              <Button
                key={f.user_id}
                type="button"
                variant="ghost"
                onClick={() => chatStore.setSelectedFriend(f)}
                className="relative shrink-0 group cursor-pointer focus:outline-none p-0 h-auto rounded-full"
                title={`${name} (Online)`}
              >
                <div className="size-9 rounded-full bg-sidebar-accent border-2 border-transparent group-hover:border-primary transition-all flex items-center justify-center text-xs font-semibold text-foreground">
                  {initial}
                </div>
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-success ring-2 ring-sidebar shadow-xs shadow-success/50" />
              </Button>
            );
          })
        )}
      </div>
    </div>
  );
}
);

OnlineFriendsList.displayName = "OnlineFriendsList";
export default OnlineFriendsList;
