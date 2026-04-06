import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, X, Share2, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Masonry from 'react-responsive-masonry';
import * as Dialog from '@radix-ui/react-dialog';
import { API_URL } from '../../services/api';

interface Photo {
  id: string;
  url: string;
  guestName: string;
  timestamp: string;
  featured?: boolean;
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'recent' | 'featured'>('recent');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const res = await fetch(`${API_URL}/photos`);
        const data = await res.json();

        const mapped: Photo[] = data.map((p: any) => ({
          id: p.id,
          url: p.imageUrl,
          guestName: p.guestName || 'Anônimo',
          timestamp: p.createdAt
            ? new Date(p.createdAt).toLocaleString('pt-BR')
            : 'Agora há pouco',
          featured: false,
        }));

        setPhotos(mapped);
      } catch (err) {
        console.error('Erro ao carregar fotos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const filteredPhotos =
    filter === 'featured'
      ? photos.filter((p) => p.featured)
      : photos;

  const handleShare = async (photo: Photo) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Foto do casamento de Maysa & Bruno',
          text: `Confira esta foto enviada por ${photo.guestName}`,
          url: photo.url,
        });
      } else {
        await navigator.clipboard.writeText(photo.url);
        alert('Link da foto copiado!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <p className="text-lg text-muted-foreground">Carregando fotos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-12" style={{ fontFamily: 'var(--font-sans)' }}>
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
            Galeria de Fotos
          </h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex gap-3 mb-8"
        >
          <button
            onClick={() => setFilter('recent')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${filter === 'recent'
                ? 'bg-primary text-white shadow-md'
                : 'bg-sand text-foreground hover:bg-muted'
              }`}
          >
            <Clock className="w-4 h-4" />
            Mais recentes
          </button>

          <button
            onClick={() => setFilter('featured')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${filter === 'featured'
                ? 'bg-primary text-white shadow-md'
                : 'bg-sand text-foreground hover:bg-muted'
              }`}
          >
            <Star className="w-4 h-4" />
            Destaques
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground mb-6"
        >
          {filteredPhotos.length} {filteredPhotos.length === 1 ? 'foto' : 'fotos'}
        </motion.p>

        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Nenhuma foto enviada ainda.
          </div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="hidden md:block">
              <Masonry columnsCount={3} gutter="1rem">
                {filteredPhotos.map((photo, index) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    index={index}
                    onClick={() => setSelectedPhoto(photo)}
                    onShare={() => handleShare(photo)}
                  />
                ))}
              </Masonry>
            </div>

            <div className="block md:hidden">
              <Masonry columnsCount={2} gutter="0.75rem">
                {filteredPhotos.map((photo, index) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    index={index}
                    onClick={() => setSelectedPhoto(photo)}
                    onShare={() => handleShare(photo)}
                  />
                ))}
              </Masonry>
            </div>
          </motion.div>
        )}
      </div>

      <Dialog.Root open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <AnimatePresence>
          {selectedPhoto && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/90 z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                  <div className="relative max-w-5xl w-full">
                    <Dialog.Close asChild>
                      <button className="absolute -top-12 right-0 text-white hover:text-gold transition-colors p-2">
                        <X className="w-8 h-8" />
                      </button>
                    </Dialog.Close>

                    <img
                      src={selectedPhoto.url}
                      alt="Photo"
                      className="w-full max-h-[80vh] object-contain rounded-2xl"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                      <div className="flex items-center justify-between text-white">
                        <div>
                          <p className="text-lg mb-1">{selectedPhoto.guestName}</p>
                          <p className="text-sm text-white/70">{selectedPhoto.timestamp}</p>
                        </div>
                        <button
                          onClick={() => handleShare(selectedPhoto)}
                          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onClick: () => void;
  onShare: () => void;
}

function PhotoCard({ photo, index, onClick, onShare }: PhotoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <img
        src={photo.url}
        alt={`Photo by ${photo.guestName}`}
        className="w-full h-auto block object-cover rounded-2xl"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm mb-1">{photo.guestName}</p>
          <p className="text-white/70 text-xs">{photo.timestamp}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <Share2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {photo.featured && (
        <div className="absolute top-4 left-4 bg-gold text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
          <Star className="w-3 h-3" fill="currentColor" />
          Destaque
        </div>
      )}
    </motion.div>
  );
}