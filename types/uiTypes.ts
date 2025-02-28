export interface Message {
  id: string;
  text: string;
  sender: "me" | "other" | "system";
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
}
