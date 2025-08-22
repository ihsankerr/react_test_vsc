import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // import your client

console.log("I'm running!");
function HabitTracker() {
  const [habit, setHabit] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add a New Habit</h2>
      <input
        type="text"
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
        placeholder="Enter a habit"
        style={{ marginRight: '10px' }}
      />
      <button onClick={handleAddHabit}>Add Habit</button>
      {showConfirmation && <p>Habit added!</p>}
    </div>
  );
}

export default HabitTracker;
