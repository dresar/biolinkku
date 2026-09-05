import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, GripVertical, Loader2, Save, X } from 'lucide-react';
import { 
  useAdminServices, 
  useCreateService, 
  useUpdateService, 
  useDeleteService 
} from '@/hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Service, GradientDirection } from '@/types/database';

const gradientDirectionOptions: { value: GradientDirection; label: string }[] = [
  { value: 'to-right', label: 'Ke Kanan' },
  { value: 'to-bottom', label: 'Ke Bawah' },
  { value: 'to-bottom-right', label: 'Ke Kanan Bawah' },
  { value: 'to-top-right', label: 'Ke Kanan Atas' },
];

const defaultFormData = {
  title: '',
  description: '',
  icon_url: '',
  link_url: '',
  color_hex: '#8B5CF6',
  gradient_color_hex: '#EC4899',
  gradient_direction: 'to-right' as GradientDirection,
  sort_order: 0,
  is_active: true,
};

export default function ServicesPage() {
  const { data: services = [], isLoading } = useAdminServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({ ...defaultFormData, sort_order: services.length });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      icon_url: service.icon_url || '',
      link_url: service.link_url || '',
      color_hex: service.color_hex,
      gradient_color_hex: service.gradient_color_hex,
      gradient_direction: service.gradient_direction,
      sort_order: service.sort_order,
      is_active: service.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        await updateService.mutateAsync({ id: editingService.id, ...formData });
        toast({ title: 'Berhasil!', description: 'Layanan berhasil diperbarui.' });
      } else {
        await createService.mutateAsync(formData);
        toast({ title: 'Berhasil!', description: 'Layanan berhasil ditambahkan.' });
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
    if (!confirm('Yakin ingin menghapus layanan ini?')) return;
    
    try {
      await deleteService.mutateAsync(id);
      toast({ title: 'Berhasil!', description: 'Layanan berhasil dihapus.' });
    } catch (error: any) {
      toast({
        title: 'Gagal',
        description: error.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await updateService.mutateAsync({ id: service.id, is_active: !service.is_active });
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
          <h1 className="text-2xl font-bold">Layanan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola layanan yang Anda tawarkan
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Layanan
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Daftar Layanan ({services.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada layanan. Klik "Tambah Layanan" untuk memulai.
              </p>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                      
                      <div 
                        className="h-10 w-10 rounded-lg flex-shrink-0"
                        style={{
                          background: `linear-gradient(to right, ${service.color_hex}, ${service.gradient_color_hex})`,
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{service.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {service.description || 'Tidak ada deskripsi'}
                        </p>
                      </div>

                      <Switch
                        checked={service.is_active}
                        onCheckedChange={() => handleToggleActive(service)}
                      />

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(service.id)}
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nama layanan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi layanan..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon_url">URL Ikon</Label>
              <Input
                id="icon_url"
                type="url"
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_url">URL Link</Label>
              <Input
                id="link_url"
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color_hex">Warna Awal</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color_hex}
                    onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })}
                    className="h-10 w-14 rounded cursor-pointer"
                  />
                  <Input
                    id="color_hex"
                    value={formData.color_hex}
                    onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gradient_color_hex">Warna Akhir</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.gradient_color_hex}
                    onChange={(e) => setFormData({ ...formData, gradient_color_hex: e.target.value })}
                    className="h-10 w-14 rounded cursor-pointer"
                  />
                  <Input
                    id="gradient_color_hex"
                    value={formData.gradient_color_hex}
                    onChange={(e) => setFormData({ ...formData, gradient_color_hex: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview Gradient</Label>
              <div 
                className="h-12 rounded-lg"
                style={{
                  background: `linear-gradient(${formData.gradient_direction.replace('to-', 'to ')}, ${formData.color_hex}, ${formData.gradient_color_hex})`,
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Arah Gradient</Label>
              <Select
                value={formData.gradient_direction}
                onValueChange={(value: GradientDirection) => setFormData({ ...formData, gradient_direction: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih arah" />
                </SelectTrigger>
                <SelectContent>
                  {gradientDirectionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div className="flex items-center justify-between pt-6">
                <Label htmlFor="is_active">Aktif</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
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
                disabled={createService.isPending || updateService.isPending}
              >
                {(createService.isPending || updateService.isPending) ? (
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