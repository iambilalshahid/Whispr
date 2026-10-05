import React, { useRef, useEffect } from "react";
import { MessageSquare, MoreVertical, CheckCheck, Circle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarBadge } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageComposer } from "./MessageComposer";
import { getDisplayName, getInitials, formatMessageTime } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { chatStore } from "@/stores";

export const ChatConversation: React.FC = observer(() => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const friend = chatStore.selectedFriend;
  const messages = chatStore.messages;
  const currentUser = chatStore.currentUser;
  const isOnline = chatStore.isSelectedFriendOnline;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!friend) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-500 p-6 select-none">
        <div className="size-16 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
          <MessageSquare size={28} />
        </div>
        <h3 className="font-semibold text-zinc-200 text-sm">
          No conversation selected
        </h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-[280px]">
          Select a friend from the sidebar or click Add Friend to start chatting.
        </p>
      </div>
    );
  }

  const friendDisplayName = getDisplayName(friend);
  const initial = getInitials(friendDisplayName);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full relative">
      {/* Header */}
      <header className="h-[68px] px-6 border-b border-sidebar-border flex items-center justify-between shrink-0 bg-sidebar/40 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <Avatar className="size-10 ring-1 ring-sidebar-border">
            <AvatarFallback className="bg-sidebar-accent border border-sidebar-border text-sidebar-accent-foreground font-bold text-xs">
              {initial}
            </AvatarFallback>
            {isOnline && (
              <AvatarBadge className="bg-success ring-2 ring-sidebar" />
            )}
          </Avatar>

          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              {friendDisplayName}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant="outline"
                className="text-[10px] font-mono text-zinc-300 border-white/10 bg-white/[0.03] px-1.5 py-0"
              >
                {friend.public_id}
              </Badge>
              <Badge
                variant={isOnline ? "default" : "secondary"}
                className={
                  isOnline
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0"
                    : "bg-white/[0.04] text-zinc-500 border border-white/5 text-[10px] px-1.5 py-0"
                }
              >
                <Circle
                  size={5}
                  className={`mr-1 fill-current ${isOnline ? "text-emerald-400" : "text-zinc-600"
                    }`}
                />
                {isOnline ? "Active now" : "Offline"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
            title="More options"
          >
            <MoreVertical size={16} />
          </Button>
        </div>
      </header>

      {/* Message Feed */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-center text-zinc-500 text-xs">
              <div className="size-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 mb-3">
                <MessageSquare size={20} />
              </div>
              <p className="font-semibold text-zinc-300">No messages yet</p>
              <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">
                Say hello to {friendDisplayName}! Text messages are delivered in
                real-time.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUser?.id;
              const time = formatMessageTime(msg.created_at);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"
                    }`}
                >
                  <div
                    className={`max-w-[70%] sm:max-w-[60%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed break-words shadow-sm ${isMe
                      ? "bg-primary text-primary-foreground rounded-br-xs font-medium"
                      : "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border rounded-bl-xs"
                      }`}
                  >
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {time}
                    </span>
                    {isMe && (
                      <CheckCheck size={12} className="text-primary" />
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Composer */}
      <MessageComposer
        recipientName={friendDisplayName}
        onSendMessage={(content) => chatStore.sendMessage(content)}
      />
    </div>
  );
});

ChatConversation.displayName = "ChatConversation";
