import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./component/home";  
import Quiz from "./component/Quiz";  
import LoginForm from "./component/login";
import End from "./component/end";


function App() {
  return (
    <Router> 
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/end" element={<End />} />
        </Routes>
      
    </Router>  
  );
}

export default App;
