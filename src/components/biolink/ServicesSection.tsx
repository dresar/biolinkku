import { motion } from 'framer-motion';
import type { Service } from '@/types/database';
import { ServiceCard } from './ServiceCard';

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const activeServices = services.filter((s) => s.is_active);

  if (activeServices.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-8"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55 }}
        className="text-lg font-semibold mb-4 gradient-text"
      >
        Layanan
      </motion.h2>

      <div className="space-y-3">
        {activeServices
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
      </div>
    </motion.section>
  );
}