import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { dockNavItems } from "@/constant";
import { handleSignOut } from "@/lib/auth";
import { chatStore } from "@/stores";
import { LogOut, Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

export const ChatDockNav: React.FC = observer(() => {
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  return (
    <aside className="w-[72px] h-screen bg-sidebar/50 backdrop-blur-md border-r border-sidebar-border flex flex-col items-center py-5 justify-between shrink-0 z-20 select-none">

      {/* TOP: Logo + Separator + Nav */}
      <div className="flex flex-col items-center gap-6 min-h-0 h-full">
        <Tooltip>
          <TooltipTrigger render={<div role="button" tabIndex={0} className="relative group cursor-pointer focus:outline-none" />}>
            <div className="size-12 rounded-2xl bg-sidebar-accent border border-sidebar-border flex items-center justify-center shadow-lg backdrop-blur-md group-hover:scale-105 transition-all overflow-hidden p-1.5">
              <img
                src="/whispr-logo.png"
                alt="Whispr"
                className="w-full h-full object-cover drop-shadow-sm select-none pointer-events-none"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Whispr</TooltipContent>
        </Tooltip>

        <Separator className="w-8 bg-sidebar-border" />

        <nav className="flex flex-col items-center gap-3">
          {dockNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = chatStore.activeDockId === item.id;
            const isDisabled = Boolean(item.disabled);

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          chatStore.setActiveDockId(item.id);
                        }
                      }}
                      className={`size-9 rounded-full transition-all ${isDisabled
                        ? "opacity-35 cursor-not-allowed text-muted-foreground hover:bg-transparent"
                        : isActive
                          ? "bg-sidebar-accent border border-sidebar-border text-foreground shadow-xs cursor-pointer"
                          : "bg-transparent hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground border border-transparent cursor-pointer"
                        }`}
                      title={item.tooltipLabel}
                    />
                  }
                >
                  <Icon size={16} />
                </TooltipTrigger>
                <TooltipContent side="right">{item.tooltipLabel}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM: Add Friend + Sign Out — justify-between pushes this here */}
      <div className="flex flex-col items-center gap-3 shrink-0 h-[20%]">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                onClick={() => chatStore.setIsAddFriendOpen(true)}
                className="size-9 rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 border border-sidebar-border text-foreground hover:text-foreground transition-all cursor-pointer shadow-xs"
              />
            }
          >
            <Plus size={16} />
          </TooltipTrigger>
          <TooltipContent side="right">Add Friend by Public ID</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setIsSignOutOpen(true)}
                className="size-9 rounded-full cursor-pointer shadow-xs"
              />
            }
          >
            <LogOut size={15} />
          </TooltipTrigger>
          <TooltipContent side="right">Sign Out</TooltipContent>
        </Tooltip>

        <ConfirmDialog
          open={isSignOutOpen}
          onOpenChange={setIsSignOutOpen}
          title="Sign Out of Whispr?"
          description="Are you sure you want to sign out of your account? You will need to sign in again to access your messages."
          confirmText="Sign Out"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={async () => {
            await handleSignOut();
          }}
        />
      </div>

    </aside>
  );
}
);

ChatDockNav.displayName = "ChatDockNav";
