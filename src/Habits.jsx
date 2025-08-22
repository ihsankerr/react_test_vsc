import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function HabitTracker() {
  const [habit, setHabit] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get the current user when the component loads
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
      } else if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  const handleAddHabit = async () => {
    if (!habit.trim() || !userId) return;

    const { data, error } = await supabase
      .from('habits')
      .insert([{ habit, user_id: userId }]); // assumes your table has a `user_id` column

    if (error) {
      console.error('Error adding habit:', error.message);
    } else {
      console.log('Habit added:', data);
      setHabit('');
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
    } else {
      window.location.reload(); // refresh to redirect to login
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
      <button onClick={handleSignOut} style={{ marginLeft: '10px' }}>Sign Out</button>
      {showConfirmation && <p>Habit added!</p>}
    </div>
  );
}

export default HabitTracker;

