import { makeAutoObservable, runInAction } from "mobx";
import type { Profile, Friend, DirectMessage } from "@/types/chat";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/toast";

export class ChatStore {
  currentUser: Profile | null = null;
  friends: Friend[] = [];
  selectedFriend: Friend | null = null;
  messages: DirectMessage[] = [];
  onlineUserIds: Set<string> = new Set();
  isAddFriendOpen = false;
  addLoading = false;
  statusMessage: { type: "error" | "success" | "info"; text: string } | null = null;
  activeDockId = "chats";

  private presenceChannel: any = null;
  private dmChannel: any = null;
  private friendshipChannel: any = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // --- Actions ---

  setCurrentUser(user: Profile | null) {
    this.currentUser = user;
  }

  setFriends(friends: Friend[]) {
    this.friends = friends;
  }

  setSelectedFriend(friend: Friend | null) {
    this.selectedFriend = friend;
  }

  setMessages(messages: DirectMessage[]) {
    this.messages = messages;
  }

  appendMessage(message: DirectMessage) {
    if (!this.messages.some((m) => m.id === message.id)) {
      this.messages.push(message);
    }
  }

  setOnlineUserIds(ids: Set<string>) {
    this.onlineUserIds = ids;
  }

  addOnlineUserId(id: string) {
    const next = new Set(this.onlineUserIds);
    next.add(id);
    this.onlineUserIds = next;
  }

  removeOnlineUserId(id: string) {
    const next = new Set(this.onlineUserIds);
    next.delete(id);
    this.onlineUserIds = next;
  }

  setIsAddFriendOpen(isOpen: boolean) {
    this.isAddFriendOpen = isOpen;
  }

  setAddLoading(loading: boolean) {
    this.addLoading = loading;
  }

  setStatusMessage(msg: { type: "error" | "success" | "info"; text: string } | null) {
    this.statusMessage = msg;
  }

  setActiveDockId(id: string) {
    this.activeDockId = id;
  }

  // --- Computed ---

  get isSelectedFriendOnline(): boolean {
    if (!this.selectedFriend) return false;
    return this.onlineUserIds.has(this.selectedFriend.user_id);
  }

  get onlineFriends(): Friend[] {
    return this.friends.filter((f) => this.onlineUserIds.has(f.user_id));
  }

  // --- Async Operations ---

  async loadInitialData() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        runInAction(() => {
          this.currentUser = profile;
        });
      }

      await this.fetchFriends(user.id);
      this.initRealtimeSubscriptions();
    } catch (err) {
      console.error("Error loading chat data:", err);
    }
  }

  async fetchFriends(myId: string) {
    const { data: friendships, error } = await supabase
      .from("friendships")
      .select("id, user_id, friend_id, status, created_at")
      .or(`user_id.eq.${myId},friend_id.eq.${myId}`)
      .eq("status", "accepted");

    if (error || !friendships) return;

    const friendUserIds = friendships.map((f) =>
      f.user_id === myId ? f.friend_id : f.user_id
    );

    if (friendUserIds.length === 0) {
      runInAction(() => {
        this.friends = [];
      });
      return;
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", friendUserIds);

    if (profiles) {
      const formatted: Friend[] = profiles.map((p) => {
        const friendship = friendships.find(
          (f) => f.user_id === p.id || f.friend_id === p.id
        );
        return {
          friendship_id: friendship?.id || "",
          user_id: p.id,
          email: p.email,
          username: p.username || "",
          first_name: p.first_name || "",
          last_name: p.last_name || "",
          public_id: p.public_id || "",
          avatar_url: p.avatar_url,
        };
      });

      runInAction(() => {
        this.friends = formatted;
        if (!this.selectedFriend && formatted.length > 0) {
          this.selectedFriend = formatted[0];
        }
      });
    }
  }

  initRealtimeSubscriptions() {
    if (!this.currentUser) return;
    const currentUserId = this.currentUser.id;

    // Presence Channel
    this.cleanupRealtime();

    this.presenceChannel = supabase.channel("online-presence-room", {
      config: { presence: { key: currentUserId } },
    });

    this.presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = this.presenceChannel.presenceState();
        const activeIds = new Set<string>();
        Object.keys(state).forEach((key) => activeIds.add(key));
        runInAction(() => {
          this.onlineUserIds = activeIds;
        });
      })
      .on("presence", { event: "join" }, ({ key }: { key: string }) => {
        this.addOnlineUserId(key);
      })
      .on("presence", { event: "leave" }, ({ key }: { key: string }) => {
        this.removeOnlineUserId(key);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await this.presenceChannel.track({
            user_id: currentUserId,
            online_at: new Date().toISOString(),
          });
        }
      });

    // Postgres Changes: Messages
    this.dmChannel = supabase
      .channel("direct_messages_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages" },
        (payload) => {
          const newMsg = payload.new as DirectMessage;
          if (
            newMsg.sender_id === currentUserId ||
            newMsg.receiver_id === currentUserId
          ) {
            runInAction(() => {
              this.appendMessage(newMsg);

              const otherPersonId =
                newMsg.sender_id === currentUserId
                  ? newMsg.receiver_id
                  : newMsg.sender_id;

              this.friends = this.friends.map((f) =>
                f.user_id === otherPersonId
                  ? {
                      ...f,
                      last_message: newMsg.content,
                      last_message_time: new Date(newMsg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    }
                  : f
              );
            });
          }
        }
      )
      .subscribe();

    // Postgres Changes: Friendships
    this.friendshipChannel = supabase
      .channel("friendships_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "friendships" },
        () => {
          this.fetchFriends(currentUserId);
        }
      )
      .subscribe();
  }

  async loadMessagesForSelectedFriend() {
    if (!this.currentUser || !this.selectedFriend) return;

    const { data, error } = await supabase
      .from("direct_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${this.currentUser.id},receiver_id.eq.${this.selectedFriend.user_id}),and(sender_id.eq.${this.selectedFriend.user_id},receiver_id.eq.${this.currentUser.id})`
      )
      .order("created_at", { ascending: true })
      .limit(100);

    if (!error && data) {
      runInAction(() => {
        this.messages = data;
      });
    }
  }

  async sendMessage(content: string) {
    if (!this.currentUser || !this.selectedFriend) return;

    const { error } = await supabase.from("direct_messages").insert({
      sender_id: this.currentUser.id,
      receiver_id: this.selectedFriend.user_id,
      content,
    });

    if (error) {
      runInAction(() => {
        this.statusMessage = {
          type: "error",
          text: `Failed to send message: ${error.message}`,
        };
      });
      toast.add({
        type: "error",
        title: "Message Failed",
        description: error.message,
        priority: "high",
      });
    }
  }

  async addFriend(publicId: string) {
    if (!this.currentUser || !publicId.trim()) return;

    runInAction(() => {
      this.addLoading = true;
      this.statusMessage = null;
    });

    const { data: targetProfile, error: searchError } = await supabase
      .from("profiles")
      .select("*")
      .ilike("public_id", publicId.trim())
      .maybeSingle();

    if (searchError || !targetProfile) {
      runInAction(() => {
        this.addLoading = false;
        this.statusMessage = {
          type: "error",
          text: "No user found with that Public ID",
        };
      });
      toast.add({
        type: "error",
        title: "User Not Found",
        description: "No user found with that Public ID",
        priority: "high",
      });
      return;
    }

    if (targetProfile.id === this.currentUser.id) {
      runInAction(() => {
        this.addLoading = false;
        this.statusMessage = {
          type: "error",
          text: "You cannot add yourself",
        };
      });
      toast.add({
        type: "warning",
        title: "Action Not Allowed",
        description: "You cannot add yourself",
      });
      return;
    }

    const { data: existing } = await supabase
      .from("friendships")
      .select("id")
      .or(
        `and(user_id.eq.${this.currentUser.id},friend_id.eq.${targetProfile.id}),and(user_id.eq.${targetProfile.id},friend_id.eq.${this.currentUser.id})`
      )
      .maybeSingle();

    if (existing) {
      runInAction(() => {
        this.addLoading = false;
        this.statusMessage = {
          type: "error",
          text: "Already friends or invite pending",
        };
      });
      toast.add({
        type: "info",
        title: "Already Added",
        description: "Already friends or invite pending",
      });
      return;
    }

    const { error: insertError } = await supabase.from("friendships").insert({
      user_id: this.currentUser.id,
      friend_id: targetProfile.id,
      status: "accepted",
    });

    runInAction(() => {
      this.addLoading = false;
    });

    if (insertError) {
      runInAction(() => {
        this.statusMessage = { type: "error", text: insertError.message };
      });
      toast.add({
        type: "error",
        title: "Failed to Add Friend",
        description: insertError.message,
        priority: "high",
      });
    } else {
      const friendName = targetProfile.first_name || targetProfile.email;
      runInAction(() => {
        this.statusMessage = {
          type: "success",
          text: `Added ${friendName} as friend!`,
        };
        this.isAddFriendOpen = false;
      });
      toast.add({
        type: "success",
        title: "Friend Added",
        description: `${friendName} has been added to your friend list.`,
      });
      await this.fetchFriends(this.currentUser.id);
    }
  }

  cleanupRealtime() {
    if (this.presenceChannel) {
      this.presenceChannel.unsubscribe();
      this.presenceChannel = null;
    }
    if (this.dmChannel) {
      this.dmChannel.unsubscribe();
      this.dmChannel = null;
    }
    if (this.friendshipChannel) {
      this.friendshipChannel.unsubscribe();
      this.friendshipChannel = null;
    }
  }

  reset() {
    this.cleanupRealtime();
    this.currentUser = null;
    this.friends = [];
    this.selectedFriend = null;
    this.messages = [];
    this.onlineUserIds = new Set();
    this.isAddFriendOpen = false;
    this.addLoading = false;
    this.statusMessage = null;
  }
}

export const chatStore = new ChatStore();
