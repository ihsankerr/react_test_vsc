// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom'; // <-- added
import { Link } from 'react-router-dom';

// Define the main HabitTracker components
function HabitTracker() {
  const [habit, setHabit] = useState('');
  const [theme, setTheme] = useState('');
  const [target, setTarget] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // <-- added

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

  // Function to handle adding a new habit
  const handleAddHabit = async () => {
    if (!habit.trim() || !userId) return;

    const cleanTheme = theme.trim() === '' ? null : theme;
    const cleanTarget = target.trim() === '' ? 1 : parseInt(target);

    if (isNaN(cleanTarget) || cleanTarget <=0) {
      console.error('Target must be a positive number');
      return;
    } 

    const { data, error } = await supabase
      .from('habits')
      .insert([{ 
        habit, 
        user_id: userId, 
        theme: cleanTheme,
        target: cleanTarget
      }])

    if (error) {
      console.error('Error adding habit:', error.message);
    } else {
      console.log('Habit added:', data);
      setHabit('');
      setTheme('');
      setTarget('');
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }
  };

  // Function to handle user sign out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
    } else {
      navigate('/'); // 👈 redirect to login page after sign out
    }
  };

  // Render the component UI
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
      <label htmlFor="theme">Habit Theme (optional)</label>
      <input
        type="text"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="e.g. Health, productivty (optional)"
        style={{ marginRight: '10px' }}
      />
      <label htmlFor="target">Target (optional)</label>
      <input
        type="number"
        min={1}
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Number of times per day (optional)"
        style={{ marginRight: '10px' }}
      />
      <button onClick={handleAddHabit}>Add Habit</button>
      <button onClick={handleSignOut} style={{ marginLeft: '10px' }}>
        Sign Out
      </button>
      <Link to="/view-habits">📋 View My Habits</Link>
      {showConfirmation && <p>Habit added!</p>}
    </div>
  );
}

export default HabitTracker;

