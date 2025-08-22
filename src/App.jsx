import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Habits from './Habits';
import ViewHabits from './ViewHabits';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/view-habits" element={<ViewHabits />} />
        <Route path="*" element={<Login />} /> {/* fallback */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;