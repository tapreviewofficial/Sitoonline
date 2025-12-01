import { motion, AnimatePresence } from "framer-motion";

interface CopySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

export function CopySuccessModal({ isOpen, onClose, code }: CopySuccessModalProps) {

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.4 
            }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="pointer-events-auto w-full max-w-sm">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-[#CC9900]/40 shadow-2xl shadow-[#CC9900]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#CC9900]/10 via-transparent to-[#CC9900]/5" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#CC9900] to-transparent" />
                
                <div className="relative p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                      Presenza Verificata™
                    </h2>
                    
                    <p className="text-white/60 text-sm uppercase tracking-widest mb-3">
                      Codice personale
                    </p>
                    
                    <p className="text-[#CC9900] font-mono text-2xl md:text-3xl font-bold mb-6 tracking-wider">
                      {code}
                    </p>
                    
                    <p className="text-white/80 text-base leading-relaxed">
                      Copia questo codice e incollalo nella recensione per mostrare che sei stato davvero qui.
                    </p>
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
