import GradientWaves from "@/components/GradientWaves";
import { StatusAlert } from "@/components/StatusAlert";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { useEffect } from "react";
import { AddFriendDialog } from "./chat/AddFriendDialog";
import { ChatConversation } from "./chat/ChatConversation";
import { ChatDockNav } from "./chat/ChatDockNav";
import { FriendProfileSidebar } from "./chat/FriendProfileSidebar";
import { ChatSidebar } from "./ChatSidebar";
import { observer } from "mobx-react-lite";
import { chatStore } from "@/stores";

export const ChatDashboard: React.FC = observer(() => {
  // Initialize chat data and realtime listeners
  useEffect(() => {
    chatStore.loadInitialData();

    return () => {
      chatStore.cleanupRealtime();
    };
  }, []);

  // Reload messages when selected friend changes
  useEffect(() => {
    chatStore.loadMessagesForSelectedFriend();
  }, [chatStore.selectedFriend?.user_id]);

  return (
    <TooltipProvider>
      {/* Outer Viewport with full-screen interactive GradientWaves Background */}
      <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground antialiased font-sans select-none flex items-center justify-center p-2 sm:p-4 md:p-6">
        {/* Full Viewport GradientWaves Canvas using global.css variables */}
        <div className="absolute inset-0 w-full h-full pointer-events-auto">
          <GradientWaves
            horizonColor="var(--primary)"
            waveColor="var(--sidebar)"
            crestColor="var(--primary)"
            speed={0.4}
            amplitude={2.5}
            waveScale={0.6}
            waveRatio={0.9}
            swell={35}
            turbulence={20}
            tilt={1.11}
            zoom={1}
            height={5.5}
            fogDepth={15}
            detail="medium"
            brightness={1}
            opacity={0.85}
            mouseInteraction
            parallaxStrength={0.5}
            grain
            grainIntensity={0.05}
          />
        </div>

        {/* Ambient Dark/Vignette Glass Overlay to maintain crisp contrast */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] pointer-events-none" />

        {/* Floating Glassmorphic Container matching GlassAuthCard */}
        <div
          className="relative z-10 w-full h-full max-w-[1500px] max-h-[920px] rounded-[32px] overflow-hidden border border-sidebar-border/40 shadow-2xl flex animate-in fade-in-50 zoom-in-95 duration-300"
          style={{
            background: "color-mix(in oklch, var(--sidebar) 75%, transparent)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            boxShadow:
              "0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
          }}
        >
          <SidebarProvider className="flex w-full h-full overflow-hidden bg-transparent">
            {/* 1. Left Icon Dock */}
            <ChatDockNav />

            {/* 2. Chat Sidebar */}
            <ChatSidebar />

            {/* 3. Center: Active Conversation */}
            <main className="flex-1 bg-background/50 border-r border-sidebar-border flex flex-col min-w-0 relative">
              {chatStore.statusMessage && (
                <div className="absolute top-4 left-6 right-6 z-30">
                  <StatusAlert
                    variant={chatStore.statusMessage.type}
                    message={chatStore.statusMessage.text}
                    onDismiss={() => chatStore.setStatusMessage(null)}
                  />
                </div>
              )}

              <ChatConversation />
            </main>

            {/* 4. Right Sidebar: Friend Profile Card */}
            <FriendProfileSidebar />

            {/* 5. Add Friend Dialog Modal */}
            <AddFriendDialog />
          </SidebarProvider>
        </div>
      </div>
    </TooltipProvider>
  );
});

export default ChatDashboard;
