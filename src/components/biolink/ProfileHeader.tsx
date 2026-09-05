import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Profile } from '@/types/database';

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const description = profile.description || '';

  useEffect(() => {
    if (!description) return;

    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index < description.length) {
        setDisplayedText(description.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [description]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center"
    >
      {/* Avatar with glowing ring */}
      <motion.div
        className="relative mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-glow-pulse" />
        
        {/* Ring */}
        <div className="relative rounded-full p-1 bg-gradient-to-br from-primary to-accent">
          <div className="rounded-full p-1 bg-background">
            <img
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'}
              alt={profile.display_name}
              className="h-28 w-28 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Status indicator */}
        <motion.div
          className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 border-2 border-background"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-bold gradient-text"
      >
        {profile.display_name}
      </motion.h1>

      {/* Title */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-1 text-sm text-muted-foreground font-medium"
      >
        {profile.title || 'Bio Link'}
      </motion.p>

      {/* Description with typing effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-4 text-sm text-foreground/80 max-w-xs"
      >
        <span>{displayedText}</span>
        {isTyping && <span className="typing-cursor" />}
      </motion.div>
    </motion.div>
  );
}