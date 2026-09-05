import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';
import type { WhatsappTemplate, WaCategory } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WhatsAppButtonProps {
  whatsappNumber: string;
  templates: WhatsappTemplate[];
}

const categoryLabels: Record<WaCategory, string> = {
  greeting: 'Sapaan',
  business: 'Bisnis',
  inquiry: 'Pertanyaan',
  support: 'Bantuan',
  other: 'Lainnya',
};

export function WhatsAppButton({ whatsappNumber, templates }: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'templates' | 'custom'>('templates');

  const activeTemplates = templates.filter((t) => t.is_active);

  const formatWhatsAppUrl = (message: string) => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  };

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      window.open(formatWhatsAppUrl(message), '_blank');
      setIsOpen(false);
      setCustomMessage('');
    }
  };

  // Group templates by category
  const templatesByCategory = activeTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<WaCategory, WhatsappTemplate[]>);

  return (
    <>
      {/* Floating button with bounce animation */}
      <motion.button
        initial={{ scale: 0, y: 100 }}
        animate={{ 
          scale: 1, 
          y: [0, -8, 0],
        }}
        transition={{ 
          scale: { delay: 1, type: 'spring', stiffness: 200 },
          y: { delay: 1.5, duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
        whileHover={{ 
          scale: 1.15,
          rotate: [0, -5, 5, 0],
          transition: { rotate: { duration: 0.3, repeat: Infinity } }
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center glow-pulse"
        style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
      >
        {/* Pulse ring */}
        <span className="pulse-ring bg-green-500" />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <MessageCircle className="h-6 w-6" />
        </motion.div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-x-4 bottom-4 z-50 max-w-md mx-auto"
            >
              <div className="glass-card overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">WhatsApp</h3>
                      <p className="text-xs text-muted-foreground">
                        Kirim pesan langsung
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                  <TabsList className="w-full rounded-none border-b">
                    <TabsTrigger value="templates" className="flex-1">
                      Template
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="flex-1">
                      Pesan Kustom
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="p-4 max-h-80 overflow-y-auto">
                    {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                      <div key={category} className="mb-4">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">
                          {categoryLabels[category as WaCategory]}
                        </h4>
                        <div className="space-y-2">
                          {categoryTemplates.map((template) => (
                            <motion.button
                              key={template.id}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSendMessage(template.message)}
                              className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">
                                  {template.title}
                                </span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {template.message}
                              </p>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {activeTemplates.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Belum ada template tersedia
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="custom" className="p-4">
                    <Textarea
                      placeholder="Tulis pesan Anda..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="min-h-32 resize-none"
                    />
                    <Button
                      onClick={() => handleSendMessage(customMessage)}
                      disabled={!customMessage.trim()}
                      className="w-full mt-4 bg-green-500 hover:bg-green-600"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Kirim Pesan
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}