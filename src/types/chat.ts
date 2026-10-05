export interface Profile {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  public_id: string;
  avatar_url?: string;
}

export interface Friend {
  friendship_id: string;
  user_id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  public_id: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}
