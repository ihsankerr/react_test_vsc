import React, { useState } from "react";
import { supabase } from './supabaseClient'; // import your client

function App() {
  const [habit, setHabit] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  
  const handleAddHabit = async () => {
    if (!habit.trim()) return;

    const { data, error } = await supabase
      .from('habits') // replace with your actual table name
      .insert([{ habit }]); // created_at will default to now()

    if (error) {
      console.error('Error adding habit:', error.message);
    } else {
      console.log('Habit added:', data);
      setHabit('');
      setConfirmation(true);
      setTimeout(() => setConfirmation(false), 2000);
    }
  };



  // const handleAddHabit = () => {
  //   if (habit.trim() !== "") {
  //     console.log("New habit:", habit);
  //     setHabit("");
  //     setConfirmation(true);

  //     // Hide the confirmation after 3 seconds
  //     setTimeout(() => {
  //       setConfirmation(false);
  //     }, 3000);
  //   }
  // };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add a Habit</h1>
      <input
        type="text"
        placeholder="Enter habit name"
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
        style={{ padding: "0.5rem", fontSize: "1rem", marginRight: "0.5rem" }}
      />
      <button onClick={handleAddHabit} style={{ padding: "0.5rem 1rem" }}>
        Add
      </button>

      {confirmation && (
        <div style={{ marginTop: "1rem", color: "green" }}>✅ Habit Added!</div>
      )}
    </div>
  );
}

export default App;
