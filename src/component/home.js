import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Img from "../asset/10740576.jpg";
import Quiz from "./Quiz";

const Home = () => {  
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate("/login");
  };

  return (
    <Box 
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        backgroundImage: `url(${Img})`,  
        backgroundSize: "cover",         
        backgroundPosition: "center",    
        backgroundRepeat: "no-repeat",   
      }}
    >
      <Typography variant="h1" gutterBottom>
        Bienvenue au Quiz!
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={startQuiz} 
        size="large"
      >
        Commencer le Quiz
      </Button>
    </Box>
  );
};

export default Home;  
