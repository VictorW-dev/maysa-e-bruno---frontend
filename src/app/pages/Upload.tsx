import { useState, useRef, DragEvent, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { Camera, Upload as UploadIcon, X, Check, ArrowLeft, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Progress from '@radix-ui/react-progress';
import * as Checkbox from '@radix-ui/react-checkbox';
import { uploadPhoto } from '../../services/api';

interface PhotoPreview {
  id: string;
  file: File;
  preview: string;
}

const MAX_PHOTOS = 10; // exemplo, pode ajustar

export default function Upload() {
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para feedback de erro
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Limpar URLs ao desmontar
  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    };
  }, [photos]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    // Filtrar apenas imagens
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    // Limitar quantidade (opcional)
    if (photos.length + validFiles.length > MAX_PHOTOS) {
      setError(`Você pode enviar no máximo ${MAX_PHOTOS} fotos por vez.`);
      return;
    }

    const newPhotos: PhotoPreview[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
    setError(null); // limpar erro se houver
  }, [photos.length]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const handleSubmit = async () => {
    if (photos.length === 0 || !agreed) {
      setError('Selecione pelo menos uma foto e concorde com os termos.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      for (let i = 0; i < photos.length; i++) {
        const formData = new FormData();
        formData.append('photo', photos[i].file);
        formData.append('guestName', guestName.trim() || 'Anônimo');
        formData.append('message', message.trim() || '');

        await uploadPhoto(formData);

        const progress = Math.round(((i + 1) / photos.length) * 100);
        setUploadProgress(progress);
      }

      setIsUploading(false);
      setUploadComplete(true);

      // Limpar estado
      setPhotos([]);
      setGuestName('');
      setMessage('');
      setAgreed(false);

      setTimeout(() => {
        navigate('/gallery');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Erro ao enviar fotos. Tente novamente.');
      setIsUploading(false);
    }
  };

  if (uploadComplete) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen bg-white pb-12 font-sans">
      <Header />

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DropZone
            isDragging={isDragging}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onFileSelect={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm"
            role="alert"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence>
          {photos.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mt-8"
            >
              <h3 className="text-lg mb-4">
                {photos.length} {photos.length === 1 ? 'foto selecionada' : 'fotos selecionadas'}
              </h3>

              <PhotoGrid photos={photos} onRemove={removePhoto} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-12 space-y-6"
        >
          <div>
            <label htmlFor="guestName" className="block mb-2 text-foreground">
              Seu nome <span className="text-muted-foreground text-sm">(opcional)</span>
            </label>
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full px-6 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 text-foreground">
              Mensagem para os noivos <span className="text-muted-foreground text-sm">(opcional)</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Deixe uma mensagem especial..."
              rows={4}
              className="w-full px-6 py-4 rounded-xl bg-stone-50 border border-stone-200 focus:border-amber-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <TermsCheckbox agreed={agreed} onAgreedChange={setAgreed} />
        </motion.div>

        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mt-8"
            >
              <UploadProgress progress={uploadProgress} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8"
        >
          <button
            type="button"
            onClick={handleSubmit}
            disabled={photos.length === 0 || !agreed || isUploading}
            className="w-full bg-amber-600 text-white py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            {isUploading ? 'Enviando...' : 'Enviar fotos'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// Componentes internos (extraídos para organização)

function Header() {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-stone-200 z-10 px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </Link>

        <h1 className="text-2xl font-serif">Enviar Fotos</h1>

        <div className="w-20" />
      </div>
    </header>
  );
}

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <h2 className="text-4xl mb-4 font-serif">Fotos enviadas com sucesso!</h2>
        <p className="text-stone-600 text-lg">Obrigado por compartilhar este momento conosco</p>
        <Heart className="w-8 h-8 mx-auto mt-6 text-amber-600" fill="currentColor" />
      </motion.div>
    </div>
  );
}

interface DropZoneProps {
  isDragging: boolean;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onFileSelect: () => void;
}

function DropZone({ isDragging, onDrop, onDragOver, onDragLeave, onFileSelect }: DropZoneProps) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
        isDragging
          ? 'border-amber-500 bg-amber-50'
          : 'border-stone-200 bg-stone-50 hover:border-amber-500/50'
      }`}
    >
      <Camera className="w-16 h-16 mx-auto mb-6 text-amber-600" />
      <h3 className="text-xl mb-2">Arraste suas fotos aqui</h3>
      <p className="text-stone-600 mb-6">ou clique no botão abaixo para selecionar</p>
      <button
        type="button"
        onClick={onFileSelect}
        className="bg-amber-600 text-white px-8 py-4 rounded-xl hover:bg-amber-700 transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      >
        <UploadIcon className="w-5 h-5" />
        Selecionar fotos
      </button>
    </div>
  );
}

interface PhotoGridProps {
  photos: PhotoPreview[];
  onRemove: (id: string) => void;
}

function PhotoGrid({ photos, onRemove }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <motion.div
          key={photo.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative aspect-square rounded-xl overflow-hidden group"
        >
          <img
            src={photo.preview}
            alt="Preview da foto selecionada"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onRemove(photo.id)}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Remover foto"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}

interface TermsCheckboxProps {
  agreed: boolean;
  onAgreedChange: (checked: boolean) => void;
}

function TermsCheckbox({ agreed, onAgreedChange }: TermsCheckboxProps) {
  return (
    <div className="flex items-start gap-3 bg-stone-50 p-6 rounded-xl">
      <Checkbox.Root
        checked={agreed}
        onCheckedChange={(checked) => onAgreedChange(checked === true)}
        className="w-6 h-6 rounded border-2 border-stone-300 bg-white flex items-center justify-center shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        id="agree"
      >
        <Checkbox.Indicator>
          <Check className="w-4 h-4 text-amber-600" />
        </Checkbox.Indicator>
      </Checkbox.Root>

      <label htmlFor="agree" className="text-sm leading-relaxed cursor-pointer text-stone-700">
        Autorizo o uso das imagens enviadas para a criação de álbum digital e compartilhamento
        com familiares e amigos dos noivos.
      </label>
    </div>
  );
}

interface UploadProgressProps {
  progress: number;
}

function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="bg-stone-50 p-6 rounded-xl">
      <p className="mb-4 text-center text-stone-700">Enviando fotos...</p>
      <Progress.Root className="relative overflow-hidden bg-stone-200 rounded-full w-full h-3">
        <Progress.Indicator
          className="bg-amber-600 h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </Progress.Root>
      <p className="text-sm text-stone-500 text-center mt-2">{progress}%</p>
    </div>
  );
}