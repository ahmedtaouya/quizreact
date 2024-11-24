import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

const Game = () => {
  const [gameId, setGameId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoinGame = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must log in first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/join-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ gameId }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        navigate("/question", { state: { gameId } });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to join the game. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 5, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Join Multiplayer Game
      </Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Game ID"
        variant="outlined"
        fullWidth
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleJoinGame}
        fullWidth
        sx={{ mt: 2 }}
      >
        Join Game
      </Button>
    </Box>
  );
};

export default Game;
