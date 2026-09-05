import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { ThemeColor } from '@/types/database';
import {
  useProfile,
  useSiteSettings,
  useSocialLinks,
  useServices,
  useProducts,
  useWhatsappTemplates,
} from '@/hooks/useBioLinkData';
import { ParticleBackground } from '@/components/particles/ParticleBackground';
import { ProfileHeader } from '@/components/biolink/ProfileHeader';
import { SocialGrid } from '@/components/biolink/SocialGrid';
import { ServicesSection } from '@/components/biolink/ServicesSection';
import { ProductsSection } from '@/components/biolink/ProductsSection';
import { WhatsAppButton } from '@/components/biolink/WhatsAppButton';
import { ThemeSwitcher } from '@/components/biolink/ThemeSwitcher';
import { Footer } from '@/components/biolink/Footer';

export default function BioLinkPage() {
  const { slug } = useParams<{ slug: string }>();
  const [theme, setTheme] = useState<ThemeColor>('purple');

  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(slug);
  const { data: siteSettings } = useSiteSettings();
  const { data: socialLinks = [] } = useSocialLinks(profile?.id);
  const { data: services = [] } = useServices(profile?.id);
  const { data: products = [] } = useProducts(profile?.id);
  const { data: templates = [] } = useWhatsappTemplates(profile?.id);

  // Set theme from profile
  useEffect(() => {
    if (profile?.theme_color) {
      setTheme(profile.theme_color);
    }
  }, [profile?.theme_color]);

  // Apply theme class to body
  useEffect(() => {
    document.documentElement.classList.remove(
      'theme-purple', 'theme-blue', 'theme-green', 
      'theme-orange', 'theme-red', 'theme-pink'
    );
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  // Update document title
  useEffect(() => {
    if (profile) {
      document.title = `${profile.display_name} | ${siteSettings?.site_title || 'Bio Link'}`;
    }
  }, [profile, siteSettings]);

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat...</p>
        </motion.div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <ParticleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center max-w-sm mx-4"
        >
          <h1 className="text-2xl font-bold gradient-text">404</h1>
          <p className="mt-2 text-muted-foreground">
            Profil tidak ditemukan
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      
      {/* Mobile-first container, centered card on desktop */}
      <div className="relative z-10 min-h-screen flex justify-center items-start py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Main content card */}
          <div className="glass-card p-6">
            <ProfileHeader profile={profile} />
            <SocialGrid socialLinks={socialLinks} />
            <ServicesSection services={services} />
            <ProductsSection products={products} />
          </div>

          <Footer footerText={siteSettings?.footer_text} />
        </motion.div>
      </div>

      {/* Theme switcher */}
      <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />

      {/* WhatsApp button */}
      {profile.whatsapp_number && (
        <WhatsAppButton
          whatsappNumber={profile.whatsapp_number}
          templates={templates}
        />
      )}
    </div>
  );
}