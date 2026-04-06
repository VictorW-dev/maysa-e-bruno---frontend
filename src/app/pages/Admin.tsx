import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Check, X, Download, Search, Filter, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPhoto {
  id: string;
  url: string;
  guestName: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockAdminPhotos: AdminPhoto[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1770022006280-dea3726f4477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMHdlZGRpbmclMjBvdXRkb29yfGVufDF8fHx8MTc3MjQ3MTc2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    guestName: 'Marina Silva',
    message: 'Parabéns aos noivos! Momento lindo!',
    timestamp: '2h atrás',
    status: 'approved'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1764269719300-7094d6c00533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VsZWJyYXRpb24lMjBndWVzdHMlMjBkYW5jaW5nfGVufDF8fHx8MTc3MjQ3MTg4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    guestName: 'Carlos Mendes',
    message: 'Celebração incrível!',
    timestamp: '3h atrás',
    status: 'pending'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1719223852076-6981754ebf76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwdGFibGUlMjBkZWNvcmF0aW9ufGVufDF8fHx8MTc3MjQ3MTg4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    guestName: 'Ana Paula',
    message: '',
    timestamp: '4h atrás',
    status: 'approved'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1584158531321-2a1fefff2e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGVsZWdhbnQlMjB3aGl0ZXxlbnwxfHx8fDE3NzI0NzE4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    guestName: 'Roberto Costa',
    message: 'Que bolo lindo!',
    timestamp: '5h atrás',
    status: 'pending'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1762941744800-385b067dff21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcG9ydHJhaXQlMjBvdXRkb29yfGVufDF8fHx8MTc3MjQ3MTg4NXww&ixlib=rb-4.1.0&q=80&w=1080',
    guestName: 'Juliana Santos',
    message: 'Vocês são lindos juntos!',
    timestamp: '6h atrás',
    status: 'pending'
  }
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<AdminPhoto[]>(mockAdminPhotos);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha simples para a noiva (em produção, usar autenticação real)
    if (password === 'maysa2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta');
    }
  };

  const handleApprove = (id: string) => {
    setPhotos(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'approved' as const } : p
    ));
  };

  const handleReject = (id: string) => {
    setPhotos(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'rejected' as const } : p
    ));
  };

  const handleDownloadAll = () => {
    // Simulação de download - em produção, fazer download real das fotos aprovadas
    const approvedPhotos = photos.filter(p => p.status === 'approved');
    console.log(`Baixando ${approvedPhotos.length} fotos aprovadas...`);
    alert(`Download iniciado! ${approvedPhotos.length} fotos aprovadas serão baixadas.`);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6" style={{ fontFamily: 'var(--font-sans)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <h1 
              className="text-4xl mb-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Área da Noiva
            </h1>
            <p className="text-muted-foreground">
              Acesso restrito para Maysa
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block mb-2 text-foreground">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-6 py-4 rounded-xl bg-sand border border-border focus:border-gold focus:outline-none transition-colors"
                autoFocus
              />
              {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-4 px-8 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Entrar
            </button>

            <Link 
              to="/" 
              className="block text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              Voltar para o início
            </Link>
          </form>
        </motion.div>
      </div>
    );
  }

  const filteredPhotos = photos.filter(photo => {
    const matchesStatus = filterStatus === 'all' || photo.status === filterStatus;
    const matchesSearch = photo.guestName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: photos.length,
    pending: photos.filter(p => p.status === 'pending').length,
    approved: photos.filter(p => p.status === 'approved').length,
    rejected: photos.filter(p => p.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-white pb-12" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-border z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <h1 
            className="text-2xl md:text-3xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Olá, Maysa! 💕
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-600' },
            { label: 'Pendentes', value: stats.pending, color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Aprovadas', value: stats.approved, color: 'bg-green-50 text-green-600' },
            { label: 'Rejeitadas', value: stats.rejected, color: 'bg-red-50 text-red-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`${stat.color} rounded-2xl p-6 text-center`}
            >
              <div className="text-3xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                {stat.value}
              </div>
              <div className="text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome do convidado..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-sand border border-border focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 bg-sand rounded-xl p-1">
            <Filter className="w-5 h-5 text-muted-foreground ml-2" />
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                  filterStatus === status
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-white/50'
                }`}
              >
                {status === 'all' ? 'Todas' : 
                 status === 'pending' ? 'Pendentes' :
                 status === 'approved' ? 'Aprovadas' : 'Rejeitadas'}
              </button>
            ))}
          </div>

          {/* Download All */}
          <button
            onClick={handleDownloadAll}
            disabled={stats.approved === 0}
            className="bg-gold text-white px-6 py-3 rounded-xl hover:bg-gold/90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Baixar aprovadas ({stats.approved})
          </button>
        </motion.div>

        {/* Photos Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
        >
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sand border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm">Preview</th>
                  <th className="text-left p-4 text-sm">Convidado</th>
                  <th className="text-left p-4 text-sm">Mensagem</th>
                  <th className="text-left p-4 text-sm">Horário</th>
                  <th className="text-left p-4 text-sm">Status</th>
                  <th className="text-right p-4 text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPhotos.map((photo, index) => (
                  <motion.tr
                    key={photo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-sand/50 transition-colors"
                  >
                    <td className="p-4">
                      <img
                        src={photo.url}
                        alt={photo.guestName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="p-4">{photo.guestName}</td>
                    <td className="p-4 max-w-xs">
                      <p className="truncate text-muted-foreground text-sm">
                        {photo.message || '—'}
                      </p>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{photo.timestamp}</td>
                    <td className="p-4">
                      <StatusBadge status={photo.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        {photo.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(photo.id)}
                            className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                            title="Aprovar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {photo.status !== 'rejected' && (
                          <button
                            onClick={() => handleReject(photo.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                            title="Rejeitar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4"
              >
                <div className="flex gap-4">
                  <img
                    src={photo.url}
                    alt={photo.guestName}
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-medium">{photo.guestName}</p>
                        <p className="text-xs text-muted-foreground">{photo.timestamp}</p>
                      </div>
                      <StatusBadge status={photo.status} />
                    </div>
                    {photo.message && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {photo.message}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {photo.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(photo.id)}
                          className="flex-1 p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Aprovar
                        </button>
                      )}
                      {photo.status !== 'rejected' && (
                        <button
                          onClick={() => handleReject(photo.id)}
                          className="flex-1 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Rejeitar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground">Nenhuma foto encontrada</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AdminPhoto['status'] }) {
  const config = {
    pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700' },
    approved: { label: 'Aprovada', className: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejeitada', className: 'bg-red-100 text-red-700' }
  };

  const { label, className } = config[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${className} whitespace-nowrap`}>
      {label}
    </span>
  );
}