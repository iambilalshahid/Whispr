import { Button } from "@/components/ui/button";
import { copyToClipboard, getDisplayName, getInitials } from "@/lib/utils";
import { Check, Copy, Loader2, Plus } from "lucide-react";
import React from "react";
import { SidebarHeader } from "./ui/sidebar";
import { observer } from "mobx-react-lite";
import { chatStore } from "@/stores";

export const InnerSidebarHeader: React.FC = observer(() => {
  const [copied, setCopied] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const currentUser = chatStore.currentUser;

  const displayName = getDisplayName(currentUser, "You");
  const initial = getInitials(displayName, "U");

  return (
    <SidebarHeader className="p-4 pb-3 border-b border-sidebar-border group-data-[collapsible=icon]:p-2 shrink-0">
      <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-3 min-w-0 group-data-[collapsible=icon]:gap-0">
          <div className="relative shrink-0">
            <div className="size-11 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center font-bold text-xs text-sidebar-accent-foreground shadow-inner">
              {initial}
            </div>
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-success ring-2 ring-sidebar" />
          </div>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <h2 className="text-xs font-bold text-foreground tracking-tight truncate">
              {displayName}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10.5px] font-mono text-success truncate">
                {currentUser?.public_id || "..."}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  if (!currentUser?.public_id || isPending) return;
                  startTransition(async () => {
                    const success = await copyToClipboard(currentUser.public_id, {
                      label: `Public ID (${currentUser.public_id})`,
                    });
                    if (success) {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  });
                }}
                className="rounded text-muted-foreground hover:text-foreground hover:bg-sidebar-accent cursor-pointer h-auto p-1"
                title="Copy my Public ID"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : copied ? (
                  <Check size={11} className="text-success" />
                ) : (
                  <Copy size={11} />
                )}
              </Button>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => chatStore.setIsAddFriendOpen(true)}
          className="rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 border border-sidebar-border text-foreground flex items-center justify-center transition-all cursor-pointer shrink-0 group-data-[collapsible=icon]:hidden"
          title="Add Friend"
        >
          <Plus size={14} />
        </Button>
      </div>
    </SidebarHeader>
  );
}
);

InnerSidebarHeader.displayName = "InnerSidebarHeader";
export default InnerSidebarHeader;