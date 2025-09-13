import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
export const ThemeToggleButton = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative overflow-hidden
        bg-gray-200 dark:bg-gray-700
        hover:bg-gray-300 dark:hover:bg-gray-600
        border border-gray-300 dark:border-gray-600
        rounded-full
        transition-all duration-300 ease-in-out
        flex items-center justify-center
        group
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Sun 
          className={`
            absolute transition-all duration-300 ease-in-out
            text-yellow-500
            ${theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
            }
          `}
          size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
        />
        <Moon 
          className={`
            absolute transition-all duration-300 ease-in-out
            text-blue-400
            ${theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
            }
          `}
          size={size === 'sm' ? 16 : size === 'md' ? 20 : 24}
        />
      </div>
    </button>
  );
};

// Alternative Sliding Toggle Button
export const SlidingThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-16 h-8 rounded-full p-1
        bg-gray-300 dark:bg-gray-600
        transition-colors duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div
        className={`
          absolute top-1 w-6 h-6 rounded-full
          bg-white dark:bg-gray-800
          shadow-md
          transition-transform duration-300 ease-in-out
          flex items-center justify-center
          ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'}
        `}
      >
        <Sun 
          className={`
            absolute transition-all duration-200
            text-yellow-500
            ${theme === 'light' ? 'opacity-100' : 'opacity-0'}
          `}
          size={14}
        />
        <Moon 
          className={`
            absolute transition-all duration-200
            text-blue-400
            ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}
          `}
          size={14}
        />
      </div>
    </button>
  );
};