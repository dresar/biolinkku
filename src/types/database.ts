export type ThemeColor = 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'pink';
export type GradientDirection = 'to-right' | 'to-bottom' | 'to-bottom-right' | 'to-top-right';
export type SocialPlatform = 'instagram' | 'tiktok' | 'github' | 'twitter' | 'linkedin' | 'youtube' | 'facebook' | 'telegram' | 'discord' | 'website';
export type WaCategory = 'greeting' | 'business' | 'inquiry' | 'support' | 'other';
export type AppRole = 'admin' | 'user';

export interface Profile {
  id: string;
  user_id: string | null;
  display_name: string;
  title: string | null;
  description: string | null;
  avatar_url: string | null;
  whatsapp_number: string | null;
  slug: string;
  theme_color: ThemeColor;
  login_count: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_title: string | null;
  site_description: string | null;
  meta_keywords: string | null;
  favicon_url: string | null;
  footer_text: string | null;
  admin_avatar_url: string | null;
  admin_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  profile_id: string | null;
  platform: SocialPlatform;
  username: string | null;
  url: string;
  icon_name: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  profile_id: string | null;
  title: string;
  description: string | null;
  icon_url: string | null;
  link_url: string | null;
  color_hex: string;
  gradient_color_hex: string;
  gradient_direction: GradientDirection;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  profile_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  discount_price: number | null;
  link_url: string | null;
  link_label: string;
  additional_link_url: string | null;
  additional_link_label: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface WhatsappTemplate {
  id: string;
  profile_id: string | null;
  title: string;
  category: WaCategory;
  message: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}