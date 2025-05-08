import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import useDarkMode from '../Hooks/useDarkMode';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      className="text-xl p-2 rounded-full transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-500" />}
    </button>
  );
};

export default ThemeToggle;
