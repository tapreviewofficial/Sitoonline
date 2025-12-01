import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Shield } from "lucide-react";

interface CopySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export function CopySuccessModal({ isOpen, onClose, code }: CopySuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`\nTapTrust Verification Key: ${code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300
            }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="pointer-events-auto w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#151515] via-[#0d0d0d] to-[#000000] border border-[#CC9900]/30 shadow-[0_0_60px_rgba(204,153,0,0.15)]">
                
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(204,153,0,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(204,153,0,0.08),transparent_50%)]" />
                
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC9900] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#CC9900]/30 to-transparent" />
                
                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 bg-[#CC9900]/20 rounded-full blur-3xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative p-8 md:p-10">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.15 }}
                      className="flex justify-center mb-6"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CC9900] to-[#8B6914] flex items-center justify-center shadow-lg shadow-[#CC9900]/30 rotate-3">
                        <Shield className="w-8 h-8 text-black" />
                      </div>
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 mb-2 tracking-tight">
                      Presenza Verificata™
                    </h2>
                    
                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#CC9900] to-transparent mx-auto mb-6" />
                    
                    <p className="text-[#CC9900]/80 text-xs uppercase tracking-[0.3em] mb-4 font-medium">
                      Codice personale
                    </p>
                    
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative mb-6"
                    >
                      <div className="absolute inset-0 bg-[#CC9900]/10 blur-xl rounded-2xl" />
                      <div className="relative bg-black/50 border border-[#CC9900]/30 rounded-2xl py-4 px-6">
                        <p className="text-[#CC9900] font-mono text-2xl md:text-3xl font-bold tracking-[0.15em]">
                          {code}
                        </p>
                      </div>
                    </motion.div>
                    
                    <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
                      Copia questo codice e incollalo nella recensione per mostrare che sei stato davvero qui.
                    </p>

                    <motion.button
                      onClick={handleCopy}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
                        copied 
                          ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                          : 'bg-gradient-to-r from-[#CC9900] to-[#A67C00] text-black hover:shadow-lg hover:shadow-[#CC9900]/30'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5" />
                          Copiato!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          Copia Codice
                        </>
                      )}
                    </motion.button>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/40 text-xs mt-4 flex items-center justify-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Il codice viene copiato automaticamente
                    </motion.p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
