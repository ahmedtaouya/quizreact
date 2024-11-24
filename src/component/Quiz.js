import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, FormControl, Radio, RadioGroup, FormControlLabel, Button, Box, Alert, TextField, List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Question = () => {
  const [questions, setQuestions] = useState([]); // Store all questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);  // Keep track of answers
  const [time, setTime] = useState(0); // Timer for quiz
  const ws = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Connect to the WebSocket server
    ws.current = new WebSocket('ws://localhost:3080');

    // Handle incoming messages from the WebSocket server
    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.type === 'allQuestions') {
        // Set the entire question list
        setQuestions(data.questions);
      } else if (data.type === 'message') {
        // Update the chat messages
        setMessages((prev) => [...prev, data]);
      }
    };

    // Cleanup the WebSocket connection on component unmount
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const handleNext = () => {
    if (selectedAnswer === '') {
      setError('Please select an answer!');
      return;
    }

    // Store the user's answer
    setUserAnswers(prevAnswers => [
      ...prevAnswers,
      { q: questions[currentQuestionIndex].question, a: selectedAnswer, correctAnswer: questions[currentQuestionIndex].answer }
    ]);

    // Send the answer to the WebSocket server
    const answerData = {
      type: 'submitAnswer',
      answer: selectedAnswer,
    };
    ws.current.send(JSON.stringify(answerData));

    // Go to the next question
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setSelectedAnswer('');
    setError('');
  };

  const handlePrevious = () => {
    // Go to the previous question if not already at the first one
    setCurrentQuestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleSubmit = () => {
    if (selectedAnswer === '') {
      setError('Please select an answer!');
      return;
    }

    // Store the user's answer
    setUserAnswers(prevAnswers => [
      ...prevAnswers,
      { q: questions[currentQuestionIndex].question, a: selectedAnswer, correctAnswer: questions[currentQuestionIndex].answer }
    ]);

    // Send the answer to the WebSocket server
    const answerData = {
      type: 'submitAnswer',
      answer: selectedAnswer,
    };
    ws.current.send(JSON.stringify(answerData));

    // Navigate to the '/end' page after submitting the answer
    navigate('/end', { state: { answers: userAnswers, time } });
  };

  const handleChange = (e) => {
    setSelectedAnswer(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleSendMessage = () => {
    if (newMessage) {
      const messageData = {
        type: 'message',
        content: newMessage,
      };
      ws.current.send(JSON.stringify(messageData));
      setNewMessage('');
    }
  };

  // Timer logic (just an example of tracking time)
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
      <CardContent>
        {/* Question Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Question {currentQuestionIndex + 1}</Typography>
        </Box>
        {questions.length > 0 ? (
          <>
            <Typography variant="h5" sx={{ mt: 2 }}>
              {questions[currentQuestionIndex].question}
            </Typography>

            {/* Display choices */}
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <RadioGroup value={selectedAnswer} onChange={handleChange}>
                {questions[currentQuestionIndex].choices.map((choice, i) => (
                  <FormControlLabel
                    key={i}
                    value={choice}
                    control={<Radio />}
                    label={choice}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </>
        ) : (
          <Typography variant="body1">Loading questions...</Typography>
        )}

        {/* Error message */}
        {error && <Alert severity="error">{error}</Alert>}

        <Box display="flex" justifyContent="space-between" sx={{ p: 2 }}>
        <Button variant="contained" color="primary" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous Question
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
          Next Question
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          Submit Answer
        </Button>
      </Box>

        {/* Chat Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Chat Room</Typography>
          <List sx={{ maxHeight: 200, overflow: 'auto', backgroundColor: '#f0f0f0', p: 1 }}>
            {messages.map((msg, index) => (
              <ListItem key={index}>{msg.content}</ListItem>
            ))}
          </List>
          <Box display="flex" mt={2}>
            <TextField
              fullWidth
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </Box>
        </Box>
      </CardContent>      
    </Card>
  );
};

export default Question;
