import { Box, TextField, IconButton } from "@mui/material";
import MessageBuble from '@/components/ui/MessageBuble';
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";

type MessageBubbleProps = {
  text: string;
  direction: "receive" | "send";
};
const MessageChat = () => {

  const [messages, setMessages] = useState<MessageBubbleProps[]>([]);
  const [input, setInput] = useState<String>('');
  const sendMessage = () => {
    if (!input.trim()) return;

    console.log("Sending:", input);
    setMessages((oldMessages) => [
      ...oldMessages,
      {
        text: `${input}`,
        direction: "send"
      }
    ]);
    setInput(""); 
  };
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E0E0E0",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#F5F5F5",
          height: 500,
          width: 800,
          borderRadius: 3,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: 2 }}>
          {messages.map(message=> <MessageBuble text={message.text} direction={message.direction}/>)}
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            size="small"
            sx={{ backgroundColor: "white", borderRadius: 2 }}
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent newline if multiline is enabled
              sendMessage();
            }
          }}
          />
          <IconButton color="primary">
            <SendIcon onClick={sendMessage}/>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageChat;