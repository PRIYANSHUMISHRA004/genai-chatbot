import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Paper,
  InputBase,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from "@mui/material";

export type Message = {
  role: "user" | "model";
  content: string;
};

interface ChatbotProps {
  history: Message[];
  isLoading: boolean;
  onSendMessage: (chatText: string) => void;
  onClearHistory: () => void;
}

export function ChatbotUI({ history, isLoading, onSendMessage, onClearHistory }: ChatbotProps) {
  const [chat, setChat] = useState("");
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isLoading]);

  const handleSend = () => {
    if (!chat.trim() || isLoading) return;
    onSendMessage(chat.trim());
    setChat("");
  };

  const isConversationEmpty = history.length === 0;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        bgcolor: "#ffffff",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* 1. Left Sidebar (240px) */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: "#f5f5f5",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}
      >
        {/* App Title */}
        <Box sx={{ p: 2, pt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2", letterSpacing: "-0.5px" }}>
            GenAI Assistant
          </Typography>
        </Box>

        {/* New Chat Button */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onClearHistory}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              py: 1,
              borderColor: "#e0e0e0",
              color: "#333333",
              "&:hover": {
                borderColor: "#1976d2",
                bgcolor: "rgba(25, 118, 210, 0.04)"
              }
            }}
          >
            + New Chat
          </Button>
        </Box>

        <Divider />

        {/* Static Chat History */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
          <Typography variant="caption" sx={{ px: 1.5, py: 1, color: "#888888", display: "block", fontWeight: 600 }}>
            Recent Conversations
          </Typography>
          <List dense>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: "6px" }} onClick={onClearHistory}>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontSize: "0.85rem", color: "#555555", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      DSA Practice Session
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: "6px" }} onClick={onClearHistory}>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontSize: "0.85rem", color: "#555555", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      Project Workspace Setup
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ borderRadius: "6px" }} onClick={onClearHistory}>
                <ListItemText 
                  primary={
                    <Typography sx={{ fontSize: "0.85rem", color: "#555555", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      Frontend Component Design
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        <Divider />

        {/* User Info footer */}
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#4caf50" }} />
          <Typography variant="caption" sx={{ color: "#666666", fontWeight: 500 }}>
            System Ready
          </Typography>
        </Box>
      </Box>

      {/* 2. Main Chat Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        
        {/* Header */}
        <Box
          sx={{
            height: 60,
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            bgcolor: "#ffffff"
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#334155" }}>
            Chat Session
          </Typography>
          {!isConversationEmpty && (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={onClearHistory}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Clear
            </Button>
          )}
        </Box>

        {/* Message Feed / Central Box */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: "auto", 
            p: 3, 
            display: "flex", 
            flexDirection: "column",
            // Center content vertically when empty, align to top when filled
            justifyContent: isConversationEmpty ? "center" : "flex-start" 
          }}
        >
          {isConversationEmpty ? (
            /* 3. Empty State */
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", pb: 8 }}>
              <Typography sx={{ fontSize: "4rem", mb: 1 }}>🤖</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
                Welcome to GenAI Assistant
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", maxWidth: 360 }}>
                Ask anything to get started. You can build layouts, debug code, or study DSA algorithms.
              </Typography>
            </Box>
          ) : (
            /* 4. Chat Messages */
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 800, width: "100%", mx: "auto" }}>
              {history.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      width: "100%"
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        maxWidth: "75%",
                        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        bgcolor: isUser ? "#1976d2" : "#f1f5f9",
                        color: isUser ? "#ffffff" : "#1e293b",
                        border: isUser ? "none" : "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: "pre-wrap",
                          fontSize: "0.95rem",
                          lineHeight: 1.5
                        }}
                      >
                        {msg.content}
                      </Typography>
                    </Paper>
                  </Box>
                );
              })}

              {/* 6. Loading state inside chat area */}
              {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "flex-start", width: "100%", alignItems: "center", gap: 1.5, mt: 1 }}>
                  <CircularProgress size={16} sx={{ color: "#1976d2" }} />
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                    Thinking...
                  </Typography>
                </Box>
              )}
              <div ref={feedEndRef} />
            </Box>
          )}
        </Box>

        {/* 5. Input Area */}
        <Box sx={{ p: 3, borderTop: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "center",
                p: 1,
                border: "1px solid #cbd5e1",
                borderRadius: "24px",
                bgcolor: "#ffffff",
                transition: "border-color 0.15s",
                "&:focus-within": {
                  borderColor: "#1976d2"
                }
              }}
            >
              <InputBase
                fullWidth
                multiline
                maxRows={4}
                value={chat}
                disabled={isLoading}
                onChange={(e) => setChat(e.target.value)}
                placeholder="Ask AI anything..."
                sx={{
                  px: 2,
                  py: 0.8,
                  fontSize: "0.95rem",
                  color: "#1e293b"
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <Button
                variant="contained"
                disabled={!chat.trim() || isLoading}
                onClick={handleSend}
                sx={{
                  bgcolor: "#1976d2",
                  color: "#ffffff",
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 0.8,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#1565c0",
                    boxShadow: "none"
                  }
                }}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
