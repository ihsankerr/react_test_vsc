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

//   // Render the component UI
//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Add a New Habit</h2>
//       <input
//         type="text"
//         value={habit}
//         onChange={(e) => setHabit(e.target.value)}
//         placeholder="Enter a habit"
//         style={{ marginRight: '10px' }}
//       />
//       <label htmlFor="theme">Habit Theme (optional)</label>
//       <input
//         type="text"
//         value={theme}
//         onChange={(e) => setTheme(e.target.value)}
//         placeholder="e.g. Health, productivty (optional)"
//         style={{ marginRight: '10px' }}
//       />
//       <label htmlFor="target">Target (optional)</label>
//       <input
//         type="number"
//         min={1}
//         value={target}
//         onChange={(e) => setTarget(e.target.value)}
//         placeholder="Number of times per day (optional)"
//         style={{ marginRight: '10px' }}
//       />
//       <button onClick={handleAddHabit}>Add Habit</button>
//       <button onClick={handleSignOut} style={{ marginLeft: '10px' }}>
//         Sign Out
//       </button>
//       <Link to="/view-habits">📋 View My Habits</Link>
//       {showConfirmation && <p>Habit added!</p>}
//     </div>
//   );
// }

// export default HabitTracker;

  // Render the component UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            ✨ Habit Tracker
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Build better habits, one day at a time
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
            Add a New Habit
          </h2>

          <div className="space-y-5">
            {/* Habit Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habit Name *
              </label>
              <input
                type="text"
                value={habit}
                onChange={(e) => setHabit(e.target.value)}
                placeholder="e.g. Drink 8 glasses of water"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Theme Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Health, Productivity"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Target Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Target <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="number"
                min={1}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Times per day (default: 1)"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Add Habit Button */}
            <button
              onClick={handleAddHabit}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              ✅ Add Habit
            </button>
          </div>
        </div>

        {/* Navigation Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <Link
            to="/view-habits"
            className="flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-3 px-6 rounded-2xl hover:from-green-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-decoration-none"
          >
            📋 View My Habits
          </Link>
        </div>

        {/* Sign Out Button */}
        <div className="text-center">
          <button
            onClick={handleSignOut}
            className="text-gray-600 hover:text-red-500 font-medium py-2 px-4 rounded-lg hover:bg-red-50 transition-all duration-200"
          >
            🚪 Sign Out
          </button>
        </div>

        {/* Confirmation Message */}
        {showConfirmation && (
          <div className="fixed bottom-6 left-4 right-4 mx-auto max-w-sm">
            <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg text-center font-medium animate-bounce">
              🎉 Habit added successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HabitTracker;