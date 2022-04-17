import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Main from './Routes/Main';
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/my-web" element={<Main />} />
    </Routes>
  </Router>
  );
}

export default App;
