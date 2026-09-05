import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Profile, SocialLink, Service, Product, WhatsappTemplate, SiteSettings } from '@/types/database';

// Profile hooks
export function useUserProfile() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Social Links hooks
export function useAdminSocialLinks() {
  const { data: profile } = useUserProfile();
  
  return useQuery({
    queryKey: ['admin-social-links', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', profile.id)
        .order('sort_order');
      
      if (error) throw error;
      return data as SocialLink[];
    },
    enabled: !!profile,
  });
}

export function useCreateSocialLink() {
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile();
  
  return useMutation({
    mutationFn: async (link: Omit<SocialLink, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => {
      if (!profile) throw new Error('No profile');
      
      const { data, error } = await supabase
        .from('social_links')
        .insert({ ...link, profile_id: profile.id })
        .select()
        .single();
      
      if (error) throw error;
      return data as SocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-social-links'] });
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
    },
  });
}

export function useUpdateSocialLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SocialLink> & { id: string }) => {
      const { data, error } = await supabase
        .from('social_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as SocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-social-links'] });
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
    },
  });
}

export function useDeleteSocialLink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-social-links'] });
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
    },
  });
}

// Services hooks
export function useAdminServices() {
  const { data: profile } = useUserProfile();
  
  return useQuery({
    queryKey: ['admin-services', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('profile_id', profile.id)
        .order('sort_order');
      
      if (error) throw error;
      return data as Service[];
    },
    enabled: !!profile,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile();
  
  return useMutation({
    mutationFn: async (service: Omit<Service, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => {
      if (!profile) throw new Error('No profile');
      
      const { data, error } = await supabase
        .from('services')
        .insert({ ...service, profile_id: profile.id })
        .select()
        .single();
      
      if (error) throw error;
      return data as Service;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Service> & { id: string }) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Service;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

// Products hooks
export function useAdminProducts() {
  const { data: profile } = useUserProfile();
  
  return useQuery({
    queryKey: ['admin-products', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('profile_id', profile.id)
        .order('sort_order');
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!profile,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile();
  
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => {
      if (!profile) throw new Error('No profile');
      
      const { data, error } = await supabase
        .from('products')
        .insert({ ...product, profile_id: profile.id })
        .select()
        .single();
      
      if (error) throw error;
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// WhatsApp Templates hooks
export function useAdminTemplates() {
  const { data: profile } = useUserProfile();
  
  return useQuery({
    queryKey: ['admin-templates', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .eq('profile_id', profile.id)
        .order('sort_order');
      
      if (error) throw error;
      return data as WhatsappTemplate[];
    },
    enabled: !!profile,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile();
  
  return useMutation({
    mutationFn: async (template: Omit<WhatsappTemplate, 'id' | 'profile_id' | 'created_at' | 'updated_at'>) => {
      if (!profile) throw new Error('No profile');
      
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .insert({ ...template, profile_id: profile.id })
        .select()
        .single();
      
      if (error) throw error;
      return data as WhatsappTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
      queryClient.invalidateQueries({ queryKey: ['whatsapp-templates'] });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WhatsappTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as WhatsappTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
      queryClient.invalidateQueries({ queryKey: ['whatsapp-templates'] });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('whatsapp_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
      queryClient.invalidateQueries({ queryKey: ['whatsapp-templates'] });
    },
  });
}

// Site Settings hooks
export function useAdminSiteSettings() {
  return useQuery({
    queryKey: ['admin-site-settings'],
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

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<SiteSettings>) => {
      // Get the first settings record
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .single();
      
      if (!existing) throw new Error('No settings found');
      
      const { data, error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as SiteSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });
}