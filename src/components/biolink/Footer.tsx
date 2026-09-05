import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FooterProps {
  footerText?: string | null;
}

export function Footer({ footerText }: FooterProps) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="mt-12 py-6"
    >
      <div className="glass-card py-4 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          {footerText || '© 2025 Bio Link. All rights reserved.'}
        </p>
        <p className="mt-2 text-xs text-muted-foreground flex items-center justify-center gap-1">
          Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by Lovable
        </p>
      </div>
    </motion.footer>
  );
}