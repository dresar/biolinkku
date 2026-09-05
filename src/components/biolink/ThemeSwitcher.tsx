import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Moon, Sun } from 'lucide-react';
import type { ThemeColor } from '@/types/database';

interface ThemeSwitcherProps {
  currentTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
}

const themes: { color: ThemeColor; label: string; class: string }[] = [
  { color: 'purple', label: 'Ungu', class: 'bg-purple-500' },
  { color: 'blue', label: 'Biru', class: 'bg-blue-500' },
  { color: 'green', label: 'Hijau', class: 'bg-green-500' },
  { color: 'orange', label: 'Oranye', class: 'bg-orange-500' },
  { color: 'red', label: 'Merah', class: 'bg-red-500' },
  { color: 'pink', label: 'Pink', class: 'bg-pink-500' },
];

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Check initial dark mode state
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme-mode', 'light');
    }
  };

  // Load saved theme mode on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else if (savedMode === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      {/* Dark mode toggle */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleDarkMode}
        className="h-12 w-12 rounded-full glass-card flex items-center justify-center shadow-lg overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="h-5 w-5 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="h-5 w-5 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Theme color toggle */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full glass-card flex items-center justify-center shadow-lg"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="h-5 w-5 text-primary" />
        </motion.div>
      </motion.button>

      {/* Theme options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute bottom-0 left-16 glass-card p-3"
          >
            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme, index) => (
                <motion.button
                  key={theme.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onThemeChange(theme.color);
                    setIsOpen(false);
                  }}
                  className={`
                    h-10 w-10 rounded-full ${theme.class}
                    flex items-center justify-center
                    ring-2 ring-offset-2 ring-offset-background
                    ${currentTheme === theme.color ? 'ring-primary' : 'ring-transparent'}
                    transition-all shadow-lg
                  `}
                  title={theme.label}
                >
                  {currentTheme === theme.color && (
                    <motion.div
                      layoutId="theme-check"
                      className="h-3 w-3 rounded-full bg-white shadow-md"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}