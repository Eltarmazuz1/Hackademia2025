import { Box, TextField, IconButton } from "@mui/material";
import MessageBuble from '@/components/ui/MessageBuble';
import { SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; 

type MessageBubbleProps = {
  text: string;
  direction: "receive" | "send";
};
const MessageChat = () => {

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageBubbleProps[]>([]);
  const [input, setInput] = useState<String>('');
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const payload = (chatId) ? {chatId, question: input}: {question: input};
    
    console.log("Sending:", input);
    setMessages((oldMessages) => [
      ...oldMessages,
      {
        text: `${input}`,
        direction: "send"
      }
    ]);
    setInput(""); 
    const response = await axios.post('http://localhost:3000/ask', payload)
    setChatId(response.data.chatId)
    console.log({response});
    setMessages((oldMessages) => [
      ...oldMessages,
      {
        text: `${response.data.response}`,
        direction: "receive"
      }
    ]);
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
        position: "relative"
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
      <Box sx={{
            position: "absolute",
            top: 8,
            left: 8,
          }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
    </Box>
    </Box>
  );
};

export default MessageChat;