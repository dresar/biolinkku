import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Profile, SiteSettings, SocialLink, Service, Product, WhatsappTemplate } from '@/types/database';

export function useProfile(slug?: string) {
  return useQuery({
    queryKey: ['profile', slug],
    queryFn: async () => {
      const query = supabase.from('profiles').select('*');
      
      if (slug) {
        const { data, error } = await query.eq('slug', slug).maybeSingle();
        if (error) throw error;
        return data as Profile | null;
      } else {
        // Get the first profile if no slug provided
        const { data, error } = await query.limit(1).maybeSingle();
        if (error) throw error;
        return data as Profile | null;
      }
    },
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as SiteSettings;
    },
  });
}

export function useSocialLinks(profileId?: string) {
  return useQuery({
    queryKey: ['social-links', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', profileId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as SocialLink[];
    },
    enabled: !!profileId,
  });
}

export function useServices(profileId?: string) {
  return useQuery({
    queryKey: ['services', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('profile_id', profileId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as Service[];
    },
    enabled: !!profileId,
  });
}

export function useProducts(profileId?: string) {
  return useQuery({
    queryKey: ['products', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('profile_id', profileId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!profileId,
  });
}

export function useWhatsappTemplates(profileId?: string) {
  return useQuery({
    queryKey: ['whatsapp-templates', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .eq('profile_id', profileId)
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as WhatsappTemplate[];
    },
    enabled: !!profileId,
  });
}