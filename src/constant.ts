import { OptionProp } from "@/components/CustomFields/DropdownMenuField";
import { MessageSquare, Compass, Bookmark, Bell, LucideIcon } from "lucide-react";

export const countryCodeOptions: OptionProp[] = [
    { label: "🇺🇸 United States (+1)", value: "+1" },
    { label: "🇬🇧 United Kingdom (+44)", value: "+44" },
    { label: "🇨🇦 Canada (+1)", value: "+1-CA" },
    { label: "🇵🇰 Pakistan (+92)", value: "+92" },
    { label: "🇦🇪 UAE (+971)", value: "+971" },
    { label: "🇦🇺 Australia (+61)", value: "+61" },
    { label: "🇩🇪 Germany (+49)", value: "+49" },
];

export interface DockNavItem {
    id: string;
    title: string;
    link: string;
    icon: LucideIcon;
    tooltipLabel: string;
    disabled?: boolean;
}

export const dockNavItems: DockNavItem[] = [
    {
        id: "chats",
        title: "Chats",
        link: "/chats",
        icon: MessageSquare,
        tooltipLabel: "Direct Chats",
        disabled: false,
    },
    {
        id: "explore",
        title: "Explore",
        link: "/explore",
        icon: Compass,
        tooltipLabel: "Explore Rooms (Upcoming feature)",
        disabled: true,
    },
    {
        id: "saved",
        title: "Saved",
        link: "/saved",
        icon: Bookmark,
        tooltipLabel: "Saved Messages (Currently working on it)",
        disabled: true,
    },
    {
        id: "notifications",
        title: "Notifications",
        link: "/notifications",
        icon: Bell,
        tooltipLabel: "Notifications (Upcoming feature)",
        disabled: true,
    },
];

export const LOCAL_STORAGE_CREDENTIAL_KEY = "chat_webauthn_credential";