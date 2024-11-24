import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Trophy from "../asset/trophy.png";

const End = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, time } = location.state || {}; 
  const [open, setOpen] = React.useState(false);

 
  if (!answers) {
    return (
      <Box textAlign="center" mt={5}>
        <Alert severity="error">No quiz data found. Please try again!</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Go to Quiz
        </Button>
      </Box>
    );
  }

  const correctAnswersCount = answers.filter(
    (item) => item.a === item.correctAnswer
  ).length;

  const handleTryAgain = () => {
    navigate("/quiz");
  };

  const handleViewAnswers = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2 }}>
      <Card>
      <Box
  display="flex"
  justifyContent="center"
  alignItems="center"
  sx={{ mb: 2 }}
>
  <img src={Trophy} alt="Trophy" style={{ width: "150px" }} />
</Box> 
        <CardContent>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Quiz Completed 
          </Typography>
          <Typography variant="h6" textAlign="center" gutterBottom>
            Your Results
          </Typography>
          <Typography variant="body1" textAlign="center" gutterBottom>
            Correct Answers: {correctAnswersCount} / {answers.length}
          </Typography>
          <Typography variant="body1" textAlign="center" gutterBottom>
            Score: {Math.floor((correctAnswersCount / answers.length) * 100)}%
          </Typography>
          <Typography variant="body1" textAlign="center" gutterBottom>
            Time Taken: {time} seconds
          </Typography>
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTryAgain}
              sx={{ mr: 2 }}
            >
              Try Again
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleViewAnswers}>
              View Answers
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Your Answers</DialogTitle>
        <DialogContent>
          <List>
            {answers.map((item, index) => (
              <ListItem key={index} sx={{ mb: 2 }}>
                <ListItemText
                  primary={`${index + 1}. ${item.q}`}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color={item.a === item.correctAnswer ? "green" : "red"}
                      >
                        Your Answer: {item.a}
                      </Typography>
                      {item.a !== item.correctAnswer && (
                        <Typography component="span" variant="body2" color="orange">
                          {" "} | Correct Answer: {item.correctAnswer}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default End;
