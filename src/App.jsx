import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, Target, Home, PlusCircle } from 'lucide-react';

const HabitTracker = () => {
  const [currentPage, setCurrentPage] = useState('tracker');
  const [habits, setHabits] = useState([]);
  
  // Form state for adding habits
  const [habitName, setHabitName] = useState('');
  const [habitTarget, setHabitTarget] = useState(1);

  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  // Add new habit
  const addHabit = () => {
    if (habitName.trim()) {
      const newHabit = {
        id: Date.now(), // Simple ID generation
        name: habitName.trim(),
        target: parseInt(habitTarget),
        count: 0
      };
      setHabits([...habits, newHabit]);
      setHabitName('');
      setHabitTarget(1);
      setCurrentPage('tracker'); // Navigate back to tracker
    }
  };

  // Update habit count
  const updateHabitCount = (habitId, newCount) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, count: Math.max(0, newCount) }
        : habit
    ));
  };

  // Delete habit
  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  // Get progress color based on completion
  const getProgressColor = (count, target) => {
    if (count === 0) return 'bg-gray-300';
    if (count < target) return 'bg-yellow-400';
    if (count === target) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getTextColor = (count, target) => {
    if (count === 0) return 'text-gray-600';
    if (count < target) return 'text-yellow-600';
    if (count === target) return 'text-green-600';
    return 'text-blue-600';
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-1 sm:p-2 mb-6 sm:mb-8">
      <div className="flex gap-1 sm:gap-2">
        <button
          onClick={() => setCurrentPage('tracker')}
          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
            currentPage === 'tracker'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="hidden xs:inline">Tracker</span>
        </button>
        <button
          onClick={() => setCurrentPage('add')}
          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
            currentPage === 'add'
              ? 'bg-blue-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden xs:inline">Add Habit</span>
        </button>
      </div>
    </nav>
  );

  // Add Habit Page
  const AddHabitPage = () => (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl sm:rounded-2xl mb-4">
          <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Add New Habit</h2>
        <p className="text-gray-600 text-sm sm:text-base">Create a new daily habit to track</p>
      </div>

      <div className="max-w-md mx-auto space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habit Name
          </label>
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="e.g., Drink water, Exercise, Read..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Target
          </label>
          <input
            type="number"
            value={habitTarget}
            onChange={(e) => setHabitTarget(e.target.value)}
            min="1"
            max="20"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          />
          <p className="text-xs text-gray-500 mt-1">
            How many times per day do you want to do this habit?
          </p>
        </div>

        <button
          onClick={addHabit}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg text-sm sm:text-base"
        >
          Add Habit
        </button>
      </div>
    </div>
  );

  // Habit Item Component
  const HabitItem = ({ habit }) => {
    const percentage = Math.round((habit.count / habit.target) * 100);
    const progressWidth = Math.min((habit.count / habit.target) * 100, 100);

    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Habit Info */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">{habit.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500">Target: {habit.target} times/day</p>
          </div>
          
          {/* Progress Section */}
          <div className="flex-grow w-full sm:max-w-xs">
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${getProgressColor(habit.count, habit.target)}`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-600">
                {habit.count} / {habit.target}
              </span>
              <span className={`font-semibold ${getTextColor(habit.count, habit.target)}`}>
                {percentage}%
              </span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-center">
            <button
              onClick={() => updateHabitCount(habit.id, habit.count - 1)}
              disabled={habit.count === 0}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                habit.count === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-100 text-red-600 hover:bg-red-200 active:scale-95'
              }`}
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            
            <div className="w-10 h-8 sm:w-12 sm:h-9 bg-gray-50 rounded-lg flex items-center justify-center">
              <span className="text-sm sm:text-base font-bold text-gray-800">{habit.count}</span>
            </div>
            
            <button
              onClick={() => updateHabitCount(habit.id, habit.count + 1)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-100 text-green-600 hover:bg-green-200 active:scale-95 flex items-center justify-center transition-all duration-200"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            
            <button
              onClick={() => deleteHabit(habit.id)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-100 text-red-600 hover:bg-red-200 active:scale-95 flex items-center justify-center transition-all duration-200 ml-1 sm:ml-2"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Tracker Page
  const TrackerPage = () => (
    <div>
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Today's Habits</h2>
        <p className="text-gray-600 text-sm sm:text-base">Track your daily progress</p>
      </div>

      {habits.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-8 sm:p-12 text-center">
          <Target className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No habits yet</h3>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Create your first habit to get started!</p>
          <button
            onClick={() => setCurrentPage('add')}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 text-sm sm:text-base"
          >
            Add Your First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {habits.map(habit => (
            <HabitItem key={habit.id} habit={habit} />
          ))}
          
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-6 sm:mt-8">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4">Today's Summary</h3>
              <div className="grid grid-cols-3 gap-4 sm:gap-8 text-xs sm:text-sm">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-green-600 block">
                    {habits.filter(h => h.count >= h.target).length}
                  </span>
                  <p className="text-gray-600">Completed</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-yellow-600 block">
                    {habits.filter(h => h.count > 0 && h.count < h.target).length}
                  </span>
                  <p className="text-gray-600">In Progress</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-600 block">
                    {habits.filter(h => h.count === 0).length}
                  </span>
                  <p className="text-gray-600">Not Started</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">Habit Tracker</h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Build better habits, one day at a time</p>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Page Content */}
        {currentPage === 'add' && <AddHabitPage />}
        {currentPage === 'tracker' && <TrackerPage />}
      </div>
    </div>
  );
};

export default HabitTracker;