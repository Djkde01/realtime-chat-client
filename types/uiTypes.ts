export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  token?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: string; // "me" | "other" | "system"
  timestamp: Date;
}
