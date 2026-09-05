import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Service } from '@/types/database';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ServiceCardProps {
  service: Service;
  index: number;
}

const gradientDirectionMap: Record<string, string> = {
  'to-right': 'to right',
  'to-bottom': 'to bottom',
  'to-bottom-right': 'to bottom right',
  'to-top-right': 'to top right',
};

export function ServiceCard({ service, index }: ServiceCardProps) {
  const gradientStyle = {
    background: `linear-gradient(${gradientDirectionMap[service.gradient_direction]}, ${service.color_hex}, ${service.gradient_color_hex})`,
  };

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        rotateY: 5,
        rotateX: 5,
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-xl p-[2px] cursor-pointer"
      style={gradientStyle}
    >
      {/* Inner content */}
      <div className="relative rounded-xl bg-card/90 backdrop-blur-sm p-4 h-full transition-colors group-hover:bg-card/70">
        <div className="flex items-start gap-3">
          {/* Icon */}
          {service.icon_url && (
            <div 
              className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center"
              style={gradientStyle}
            >
              <img 
                src={service.icon_url} 
                alt={service.title}
                className="h-6 w-6 object-contain"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {service.title}
            </h3>
            {service.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>
            )}
          </div>

          {service.link_url && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          )}
        </div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            translateX: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: 'linear',
          }}
        />
      </div>
    </motion.div>
  );

  if (service.link_url) {
    return (
      <a href={service.link_url} target="_blank" rel="noopener noreferrer">
        {card}
      </a>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {card}
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">{service.description || 'Tidak ada link'}</p>
      </TooltipContent>
    </Tooltip>
  );
}