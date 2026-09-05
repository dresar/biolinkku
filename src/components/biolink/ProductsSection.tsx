import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '@/types/database';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';

interface ProductsSectionProps {
  products: Product[];
}

export function ProductsSection({ products }: ProductsSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const activeProducts = products.filter((p) => p.is_active);

  if (activeProducts.length === 0) return null;

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
          className="text-lg font-semibold mb-4 gradient-text"
        >
          Produk
        </motion.h2>

        <div className="grid grid-cols-2 gap-3">
          {activeProducts
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
        </div>
      </motion.section>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}