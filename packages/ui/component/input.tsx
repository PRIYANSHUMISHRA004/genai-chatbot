import Card from "@mui/material/Card";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
type InputProps = {
    onClick: (params: string) => Promise<void>;
};
export  function Input({ onClick }: InputProps){
    let [chat,setChat]=useState<string>("");
    return(
        <div>
            <Card>
                <div>
                    <Typography variant="h3">Radhe Radhe </Typography>
                     <Typography variant="h5">DSA CHAT BOT </Typography>
                </div>
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        p: 2,
                        alignItems: "center"
                    }}
                >
                    <TextField
                        fullWidth
                        label="Ask Anything"
                        placeholder="Radhe Radhe Ask Any Thing..."
                        value={chat}
                        onChange={(e) => setChat(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onClick(chat);
                            }
                        }}
                    />

                    <Button
                        variant="contained"
                        onClick={() => onClick(chat)}
                    >
                        Send
                    </Button>
                </Box>
            </Card>
        </div>
    )
}