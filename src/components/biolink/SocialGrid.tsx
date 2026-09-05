import { motion } from 'framer-motion';
import { 
  Instagram, 
  Github, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Facebook, 
  Send as Telegram,
  MessageCircle as Discord,
  Globe,
  Music2
} from 'lucide-react';
import type { SocialLink, SocialPlatform } from '@/types/database';

const platformIcons: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  tiktok: Music2,
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  facebook: Facebook,
  telegram: Telegram,
  discord: Discord,
  website: Globe,
};

const platformColors: Record<SocialPlatform, string> = {
  instagram: 'from-pink-500 to-purple-500',
  tiktok: 'from-black to-gray-800 dark:from-white dark:to-gray-200',
  github: 'from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100',
  twitter: 'from-blue-400 to-blue-600',
  linkedin: 'from-blue-600 to-blue-800',
  youtube: 'from-red-500 to-red-700',
  facebook: 'from-blue-600 to-blue-800',
  telegram: 'from-blue-400 to-blue-500',
  discord: 'from-indigo-500 to-indigo-700',
  website: 'from-primary to-accent',
};

interface SocialGridProps {
  socialLinks: SocialLink[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

export function SocialGrid({ socialLinks }: SocialGridProps) {
  const activeLinks = socialLinks.filter((link) => link.is_active);

  if (activeLinks.length === 0) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap justify-center gap-3 mt-6"
    >
      {activeLinks.map((link, index) => {
        const Icon = platformIcons[link.platform];
        const colorClass = platformColors[link.platform];

        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={item}
            whileHover={{ 
              scale: 1.2,
              rotate: [0, -10, 10, 0],
              boxShadow: '0 0 30px hsl(var(--primary) / 0.6)',
            }}
            whileTap={{ scale: 0.9 }}
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              y: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.2,
              }
            }}
            className={`
              relative flex h-12 w-12 items-center justify-center rounded-full
              bg-gradient-to-br ${colorClass}
              text-white shadow-lg transition-all duration-300
              hover:shadow-primary/40
            `}
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.1 
              }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
            
            {/* Glow ring on hover */}
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              whileHover={{ 
                opacity: 1,
                scale: 1.4,
              }}
              transition={{ duration: 0.3 }}
              style={{
                background: `radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)`,
              }}
            />
          </motion.a>
        );
      })}
    </motion.div>
  );
}