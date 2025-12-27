interface Message {
    _id: string;
    content: string;
    createdAt: string; // or Date
}


export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>
};
