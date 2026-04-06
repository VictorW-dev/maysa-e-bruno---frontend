import { Link } from 'react-router';
import { Heart, Camera, Image } from 'lucide-react';
import { motion } from 'motion/react';

// Importando as imagens (certifique-se de que os arquivos existem nesses caminhos)
import heroImage from '../../img/M&B-85.JPG.jpeg';
import qrCodeImage from '../../img/QRCode_Fácil.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Maysa e Bruno celebrando"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Heart className="w-12 h-12 mx-auto mb-6 text-amber-400" fill="currentColor" />
            <h1 className="text-6xl md:text-8xl mb-4 font-serif font-light tracking-widest">
              Maysa & Bruno
            </h1>
            <div className="w-24 h-px bg-amber-400/80 mx-auto mb-6" />
            <p className="text-xl md:text-2xl mb-2 font-light">06 de Abril de 2026</p>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.8,
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/70 rounded-full" />
          </div>
        </motion.div>
      </motion.section>

      {/* Conteúdo principal */}
      <main>
        {/* Mensagem do casal */}
        <section className="py-20 px-6 bg-stone-50">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xl md:text-2xl leading-relaxed text-stone-700 mb-8 font-serif font-light">
                Estamos muito felizes em compartilhar este momento especial com você!
                Ajude-nos a guardar as memórias deste dia enviando suas fotos.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Botões de ação */}
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              className="space-y-4"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/upload"
                className="w-full bg-amber-600 text-white py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xl">Enviar suas fotos</span>
              </Link>

              <Link
                to="/gallery"
                className="w-full bg-stone-100 text-stone-800 py-6 px-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-stone-200 flex items-center justify-center gap-3 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
              >
                <Image className="w-6 h-6" />
                <span className="text-xl">Ver galeria</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* QR Code */}
        <section className="py-16 px-6 bg-stone-50">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl mb-6 font-serif">Acesso rápido</h3>
              <div className="bg-white p-8 rounded-2xl shadow-sm inline-block">
                <div className="w-48 h-48 md:w-56 md:h-56">
                  <img
                    src={qrCodeImage}
                    alt="QR Code para acessar o site do casamento"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="text-sm text-stone-500 mt-4">Escaneie para acessar o site</p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="py-12 px-6 text-center border-t border-stone-200">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-2xl md:text-3xl mb-2 font-serif text-amber-700">
            Com amor, Maysa & Bruno
          </p>
          <p className="text-sm text-stone-500">06.04.2026</p>

          <Link
            to="/admin"
            className="inline-block mt-6 text-xs text-stone-400 hover:text-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
          >
            Área da noiva
          </Link>
        </motion.div>
      </footer>
    </div>
  );
}