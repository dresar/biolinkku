import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { useUserProfile, useUpdateProfile } from '@/hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { ThemeColor } from '@/types/database';

const themeOptions: { value: ThemeColor; label: string }[] = [
  { value: 'purple', label: 'Ungu' },
  { value: 'blue', label: 'Biru' },
  { value: 'green', label: 'Hijau' },
  { value: 'orange', label: 'Oranye' },
  { value: 'red', label: 'Merah' },
  { value: 'pink', label: 'Pink' },
];

export default function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    display_name: '',
    title: '',
    description: '',
    avatar_url: '',
    whatsapp_number: '',
    slug: '',
    theme_color: 'purple' as ThemeColor,
  });

  // Update form when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        title: profile.title || '',
        description: profile.description || '',
        avatar_url: profile.avatar_url || '',
        whatsapp_number: profile.whatsapp_number || '',
        slug: profile.slug || '',
        theme_color: profile.theme_color || 'purple',
      });
    }
  });

  // Sync form when profile changes
  if (profile && formData.display_name !== profile.display_name && formData.display_name === '') {
    setFormData({
      display_name: profile.display_name || '',
      title: profile.title || '',
      description: profile.description || '',
      avatar_url: profile.avatar_url || '',
      whatsapp_number: profile.whatsapp_number || '',
      slug: profile.slug || '',
      theme_color: profile.theme_color || 'purple',
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile.mutateAsync(formData);
      toast({ title: 'Berhasil!', description: 'Profil berhasil diperbarui.' });
    } catch (error: any) {
      toast({
        title: 'Gagal',
        description: error.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="text-muted-foreground mt-1">
          Kelola informasi profil Bio Link Anda
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Nama Tampilan</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Jabatan/Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Software Developer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ceritakan tentang diri Anda..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar_url">URL Avatar</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Gunakan URL gambar dari Unsplash, Cloudinary, atau CDN lainnya
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_number">Nomor WhatsApp</Label>
                  <Input
                    id="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="6281234567890"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: kode negara + nomor (tanpa + atau 0)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug URL</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    placeholder="john-doe"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /{formData.slug || 'your-slug'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme_color">Warna Tema</Label>
                <Select
                  value={formData.theme_color}
                  onValueChange={(value: ThemeColor) => setFormData({ ...formData, theme_color: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih warna tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {themeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}