import Paper from '@mui/material/Paper';
import { Box } from "@mui/material";
import { green } from "@mui/material/colors";


type MessageBubbleProps = {
  text: string;
  direction: "receive" | "send";
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, direction }) => {
  const isReceived = direction === "receive";

  return (
    <Box
      sx={{
        backgroundColor: isReceived ? "#e5e5ea" : "#34c759", // iMessage green
        color: isReceived ? "black" : "white",
        width: "fit-content",
        maxWidth: 360,
        padding: 1.5,
        fontSize: "16px",
        lineHeight: 1.4,
        borderRadius: 4,
        borderTopLeftRadius: isReceived ? 0 : 4,
        borderTopRightRadius: isReceived ? 4 : 0,
        marginY: 1,
        marginLeft: isReceived ? 1 : "auto",
        marginRight: isReceived ? "auto" : 1,
      }}
    >
      <p style={{ margin: 0 }}>{text}</p>
    </Box>
  );
    
};

export default MessageBubble;
