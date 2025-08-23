import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'

const ViewHabits = () => {
  const [userId, setUserId] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the user ID on mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }

      if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  // Fetch habits when userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchHabits = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('habits')
        .select('habit, theme, target')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching habits:', error.message);
      } else {
        setHabits(data);
      }

      setLoading(false);
    };

    fetchHabits();
  }, [userId]);

  if (!userId) return <p>Please log in to view your habits.</p>;

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

