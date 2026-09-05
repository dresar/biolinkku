import { motion } from 'framer-motion';
import { Link2, ShoppingBag, Briefcase, MessageSquare, Eye } from 'lucide-react';
import { useUserProfile, useAdminSocialLinks, useAdminServices, useAdminProducts, useAdminTemplates } from '@/hooks/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { data: profile } = useUserProfile();
  const { data: socialLinks = [] } = useAdminSocialLinks();
  const { data: services = [] } = useAdminServices();
  const { data: products = [] } = useAdminProducts();
  const { data: templates = [] } = useAdminTemplates();

  const stats = [
    { label: 'Media Sosial', value: socialLinks.length, icon: Link2, color: 'from-blue-500 to-cyan-500' },
    { label: 'Layanan', value: services.length, icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { label: 'Produk', value: products.length, icon: ShoppingBag, color: 'from-orange-500 to-red-500' },
    { label: 'Template WA', value: templates.length, icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang kembali, {profile?.display_name || 'User'}!
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profile Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview Bio Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'}
                alt={profile?.display_name}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-primary"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{profile?.display_name}</h3>
                <p className="text-sm text-muted-foreground">{profile?.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Slug: <code className="bg-muted px-1 rounded">/{profile?.slug}</code>
                </p>
              </div>
              <a
                href={profile?.slug ? `/${profile.slug}` : '/'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Lihat Bio Link
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tips Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Tambahkan foto profil yang menarik untuk kesan pertama yang baik</li>
              <li>• Gunakan deskripsi singkat yang menjelaskan siapa Anda</li>
              <li>• Atur urutan layanan dan produk sesuai prioritas</li>
              <li>• Buat template WhatsApp untuk memudahkan pelanggan menghubungi Anda</li>
              <li>• Gunakan warna tema yang sesuai dengan branding Anda</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}