import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { useAdminSiteSettings, useUpdateSiteSettings } from '@/hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { data: settings, isLoading } = useAdminSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    site_title: '',
    site_description: '',
    meta_keywords: '',
    favicon_url: '',
    footer_text: '',
    admin_avatar_url: '',
    admin_name: '',
  });

  // Sync form when settings change
  if (settings && formData.site_title !== settings.site_title && formData.site_title === '') {
    setFormData({
      site_title: settings.site_title || '',
      site_description: settings.site_description || '',
      meta_keywords: settings.meta_keywords || '',
      favicon_url: settings.favicon_url || '',
      footer_text: settings.footer_text || '',
      admin_avatar_url: settings.admin_avatar_url || '',
      admin_name: settings.admin_name || '',
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateSettings.mutateAsync(formData);
      toast({ title: 'Berhasil!', description: 'Pengaturan berhasil diperbarui.' });
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

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">Pengaturan Situs</h1>
          <p className="text-muted-foreground mt-1">
            Anda tidak memiliki akses untuk mengelola pengaturan situs.
          </p>
        </motion.div>

        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Hanya admin yang dapat mengubah pengaturan situs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Pengaturan Situs</h1>
        <p className="text-muted-foreground mt-1">
          Kelola pengaturan global situs Bio Link
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
              <CardTitle>Informasi Situs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site_title">Judul Situs</Label>
                  <Input
                    id="site_title"
                    value={formData.site_title}
                    onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                    placeholder="Bio Link"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_name">Nama Admin</Label>
                  <Input
                    id="admin_name"
                    value={formData.admin_name}
                    onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                    placeholder="Admin"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Deskripsi Situs</Label>
                <Textarea
                  id="site_description"
                  value={formData.site_description}
                  onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                  placeholder="Platform Bio Link Modern"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                  placeholder="biolink, linktree, social"
                />
                <p className="text-xs text-muted-foreground">
                  Pisahkan dengan koma untuk SEO
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="favicon_url">URL Favicon</Label>
                  <Input
                    id="favicon_url"
                    type="url"
                    value={formData.favicon_url}
                    onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_avatar_url">URL Avatar Admin</Label>
                  <Input
                    id="admin_avatar_url"
                    type="url"
                    value={formData.admin_avatar_url}
                    onChange={(e) => setFormData({ ...formData, admin_avatar_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_text">Teks Footer</Label>
                <Input
                  id="footer_text"
                  value={formData.footer_text}
                  onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                  placeholder="© 2025 Bio Link. All rights reserved."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={updateSettings.isPending}>
                  {updateSettings.isPending ? (
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