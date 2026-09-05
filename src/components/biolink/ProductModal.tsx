import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Info } from 'lucide-react';
import type { Product } from '@/types/database';
import { Button } from '@/components/ui/button';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null;

  const hasDiscount = product.discount_price && product.discount_price < product.price;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 max-w-md mx-auto"
          >
            <div className="glass-card overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground">
                  {product.title}
                </h2>

                {product.description && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                )}

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-3">
                  {hasDiscount ? (
                    <>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.discount_price!)}
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  {product.link_url && (
                    <Button
                      asChild
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    >
                      <a
                        href={product.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.link_label || 'Beli Sekarang'}
                      </a>
                    </Button>
                  )}

                  {product.additional_link_url && (
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1"
                    >
                      <a
                        href={product.additional_link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Info className="mr-2 h-4 w-4" />
                        {product.additional_link_label || 'Info Lanjut'}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}