import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  InputBase,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type Message = {
  role: "user" | "model";
  content: string;
};

export default function Home() {
  const [chat, setChat] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  async function handleSend() {
    const chatText = chat.trim();
    if (!chatText || isLoading) return;

    // Add user message to history
    const updatedHistory = [...history, { role: "user" as const, content: chatText }];
    setHistory(updatedHistory);
    setChat("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/chat/", {
        history: updatedHistory,
      });
      setHistory((prev) => [
        ...prev,
        { role: "model" as const, content: res.data.message },
      ]);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        alert("⚠️ Gemini API Quota Exceeded! Please try again later.");
      } else {
        console.error("Error communicating with AI agent:", error);
        setHistory((prev) => [
          ...prev,
          { role: "model" as const, content: "Error: Failed to fetch response from AI agent. Please try again." },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearHistory() {
    setHistory([]);
    setChat("");
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        height: "100vh",
        bgcolor: "#09090b", // zinc-950
        color: "#f4f4f5", // zinc-100
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* Sidebar: col-span-1 */}
      <Box
        sx={{
          gridColumn: "span 1",
          bgcolor: "#18181b", // zinc-900
          borderRight: "1px solid #27272a", // zinc-800
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: 2,
        }}
      >
        {/* Title */}
        <Box sx={{ p: 1, mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#3b82f6", // blue-500
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              letterSpacing: "-0.5px",
            }}
          >
            <SmartToyIcon />
            GenAI Chatbot
          </Typography>
        </Box>

        {/* Action Button: New Chat */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleClearHistory}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "12px",
            py: 1,
            mb: 3,
            borderColor: "#3f3f46", // zinc-700
            color: "#f4f4f5",
            "&:hover": {
              borderColor: "#3b82f6",
              bgcolor: "rgba(59, 130, 246, 0.08)",
            },
          }}
        >
          New Chat
        </Button>

        <Divider sx={{ borderColor: "#27272a", mb: 2 }} />

        {/* Recent Section */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <Typography
            variant="caption"
            sx={{
              color: "#71717a", // zinc-500
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              px: 1,
              mb: 1.5,
              display: "block",
            }}
          >
            Conversations
          </Typography>
          <List dense sx={{ px: 0 }}>
            {history.length > 0 ? (
              <ListItem
                disablePadding
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "8px",
                  borderLeft: "3px solid #3b82f6",
                }}
              >
                <Box sx={{ py: 1, px: 1.5, display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                  <ChatIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          color: "#e4e4e7",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {history[0].content}
                      </Typography>
                    }
                  />
                </Box>
              </ListItem>
            ) : (
              <Typography
                variant="body2"
                sx={{ px: 1, color: "#52525b", fontStyle: "italic" }}
              >
                No active conversations
              </Typography>
            )}
          </List>
        </Box>

        <Divider sx={{ borderColor: "#27272a", my: 2 }} />

        {/* Sidebar Footer */}
        <Box sx={{ p: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
          <Typography variant="caption" sx={{ color: "#a1a1aa", fontWeight: 500 }}>
            Platform: Online
          </Typography>
        </Box>
      </Box>

      {/* Main chat window: col-span-4 */}
      <Box
        sx={{
          gridColumn: "span 4",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "relative",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            height: 60,
            borderBottom: "1px solid #18181b",
            bgcolor: "#09090b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 4,
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#ffffff" }}>
              Active Session
            </Typography>
            <Typography variant="caption" sx={{ color: "#a1a1aa", display: "block", mt: -0.5 }}>
              Powered by Gemini 2.5 Flash
            </Typography>
          </Box>
          {history.length > 0 && (
            <Button
              variant="text"
              color="error"
              size="small"
              startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
              onClick={handleClearHistory}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#f43f5e",
                "&:hover": { bgcolor: "rgba(244, 63, 94, 0.08)" },
              }}
            >
              Clear Chat
            </Button>
          )}
        </Box>

        {/* Message Feed / Central Box */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: history.length === 0 ? "center" : "flex-start",
          }}
        >
          {history.length === 0 ? (
            /* Empty State */
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                pb: 8,
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "50%",
                  p: 3,
                  mb: 2,
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                <SmartToyIcon sx={{ fontSize: 50, color: "#3b82f6" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#ffffff", mb: 1, letterSpacing: "-0.5px" }}>
                Welcome to GenAI Chatbot
              </Typography>
              <Typography variant="body2" sx={{ color: "#71717a", maxWidth: 360, mb: 1 }}>
                Ask me to help you design components, write files, run terminal commands, or build web interfaces.
              </Typography>
            </Box>
          ) : (
            /* Chat Messages */
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                maxWidth: 800,
                width: "100%",
                mx: "auto",
              }}
            >
              {history.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: isUser ? "row-reverse" : "row",
                        gap: 1.5,
                        maxWidth: "75%",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Avatar */}
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor: isUser ? "#3b82f6" : "#27272a",
                          border: isUser ? "none" : "1px solid #3f3f46",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isUser ? (
                          <PersonIcon sx={{ fontSize: 16, color: "#ffffff" }} />
                        ) : (
                          <SmartToyIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
                        )}
                      </Box>

                      {/* Bubble */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          bgcolor: isUser ? "#2563eb" : "#18181b",
                          border: isUser ? "none" : "1px solid #27272a",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: "pre-wrap",
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                            color: isUser ? "#ffffff" : "#e4e4e7",
                          }}
                        >
                          {msg.content}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}

              {/* Thinking Loader */}
              {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "#27272a",
                        border: "1px solid #3f3f46",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SmartToyIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={14} sx={{ color: "#3b82f6" }} />
                      <Typography variant="body2" sx={{ color: "#71717a", fontStyle: "italic" }}>
                        Thinking...
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Input area */}
        <Box sx={{ p: 4, bgcolor: "#09090b" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#18181b",
              width: { xs: "95%", md: "50%" },
              mx: "auto",
              p: 0.5,
              pl: 2,
              pr: 1,
              borderRadius: "32px",
              border: "1px solid #27272a",
              height: "56px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              transition: "border-color 0.2s, box-shadow 0.2s",
              "&:focus-within": {
                borderColor: "#3b82f6",
                boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.5)",
              },
            }}
          >
            <InputBase
              fullWidth
              value={chat}
              disabled={isLoading}
              onChange={(e) => setChat(e.target.value)}
              placeholder="Ask me anything"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              sx={{
                color: "#ffffff",
                px: 1,
                fontSize: "0.95rem",
              }}
            />
            <Button
              onClick={handleSend}
              disabled={!chat.trim() || isLoading}
              variant="contained"
              sx={{
                bgcolor: "#3b82f6",
                color: "#ffffff",
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                height: "40px",
                "&:hover": {
                  bgcolor: "#2563eb",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.3)",
                },
              }}
            >
              Ask
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
