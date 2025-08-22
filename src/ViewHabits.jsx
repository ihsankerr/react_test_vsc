// src/pages/ViewHabits.jsx
import React, { useEffect, useState } from 'react';
import supabase from '../supabase'; // adjust path as needed
import { useUser } from '../UserContext'; // adjust if you have a user context

const ViewHabits = () => {
  const { user } = useUser(); // assumes you're using a context for user
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHabits = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('habits')
        .select('habit, theme, target')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching habits:', error.message);
      } else {
        setHabits(data);
      }

      setLoading(false);
    };

    fetchHabits();
  }, [user]);

  if (!user) return <p>Please log in to view your habits.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Your Habits</h2>

      {loading ? (
        <p>Loading habits...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Habit Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Theme</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Target</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{habit.habit}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{habit.theme || '—'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{habit.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewHabits;
