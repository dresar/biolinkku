import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, GripVertical, Loader2, Save, X } from 'lucide-react';
import { 
  useAdminSocialLinks, 
  useCreateSocialLink, 
  useUpdateSocialLink, 
  useDeleteSocialLink 
} from '@/hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { SocialLink, SocialPlatform } from '@/types/database';

const platformOptions: { value: SocialPlatform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'github', label: 'GitHub' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'discord', label: 'Discord' },
  { value: 'website', label: 'Website' },
];

const defaultFormData = {
  platform: 'instagram' as SocialPlatform,
  username: '',
  url: '',
  icon_name: '',
  sort_order: 0,
  is_active: true,
};

export default function SocialsPage() {
  const { data: socialLinks = [], isLoading } = useAdminSocialLinks();
  const createLink = useCreateSocialLink();
  const updateLink = useUpdateSocialLink();
  const deleteLink = useDeleteSocialLink();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const openCreateModal = () => {
    setEditingLink(null);
    setFormData({ ...defaultFormData, sort_order: socialLinks.length });
    setIsModalOpen(true);
  };

  const openEditModal = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      username: link.username || '',
      url: link.url,
      icon_name: link.icon_name || '',
      sort_order: link.sort_order,
      is_active: link.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLink) {
        await updateLink.mutateAsync({ id: editingLink.id, ...formData });
        toast({ title: 'Berhasil!', description: 'Link berhasil diperbarui.' });
      } else {
        await createLink.mutateAsync(formData);
        toast({ title: 'Berhasil!', description: 'Link berhasil ditambahkan.' });
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast({
        title: 'Gagal',
        description: error.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus link ini?')) return;
    
    try {
      await deleteLink.mutateAsync(id);
      toast({ title: 'Berhasil!', description: 'Link berhasil dihapus.' });
    } catch (error: any) {
      toast({
        title: 'Gagal',
        description: error.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (link: SocialLink) => {
    try {
      await updateLink.mutateAsync({ id: link.id, is_active: !link.is_active });
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Media Sosial</h1>
          <p className="text-muted-foreground mt-1">
            Kelola link media sosial Anda
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Link
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Daftar Link ({socialLinks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {socialLinks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada link. Klik "Tambah Link" untuk memulai.
              </p>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {socialLinks.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium capitalize">{link.platform}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {link.username || link.url}
                        </p>
                      </div>

                      <Switch
                        checked={link.is_active}
                        onCheckedChange={() => handleToggleActive(link)}
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(link)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(link.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink ? 'Edit Link' : 'Tambah Link Baru'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value: SocialPlatform) => setFormData({ ...formData, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username (opsional)</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="@username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Urutan</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                min={0}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Aktif</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createLink.isPending || updateLink.isPending}
              >
                {(createLink.isPending || updateLink.isPending) ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}