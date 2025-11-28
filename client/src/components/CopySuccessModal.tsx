import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clipboard } from "lucide-react";

interface CopySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  linkUrl?: string;
}

export function CopySuccessModal({ isOpen, onClose, code, linkUrl }: CopySuccessModalProps) {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer1 = setTimeout(() => setShowCheck(true), 200);
      const timer2 = setTimeout(() => {
        if (linkUrl) {
          window.open(linkUrl, '_blank');
        }
        onClose();
      }, 800);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setShowCheck(false);
    }
  }, [isOpen, linkUrl, onClose]);

  const handleGoToReview = () => {
    if (linkUrl) {
      window.open(linkUrl, '_blank');
    }
    onClose();
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
                  <div className="flex justify-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        damping: 15, 
                        stiffness: 200,
                        delay: 0.1 
                      }}
                      className="relative"
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#CC9900] to-[#997700] flex items-center justify-center shadow-lg shadow-[#CC9900]/30">
                        <AnimatePresence mode="wait">
                          {!showCheck ? (
                            <motion.div
                              key="clipboard"
                              initial={{ opacity: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Clipboard className="w-9 h-9 text-black" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="check"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ 
                                type: "spring", 
                                damping: 15, 
                                stiffness: 300 
                              }}
                            >
                              <Check className="w-10 h-10 text-black stroke-[3]" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [0.8, 1.2, 1], opacity: [0, 1, 0] }}
                        transition={{ 
                          duration: 1,
                          delay: 0.3,
                          repeat: 2,
                          repeatDelay: 0.5
                        }}
                        className="absolute inset-0 rounded-full border-2 border-[#CC9900]"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      Codice Copiato!
                    </h3>
                    <p className="text-white/70 text-sm mb-3">
                      Includi il Codice Univoco per inviare una Recensione Certificata
                    </p>
                    <p className="text-[#CC9900] font-mono text-lg font-bold mb-4">
                      {code}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <p className="text-white/90 text-center text-sm leading-relaxed">
                      Incolla il codice nella tua recensione
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <kbd className="px-3 py-1.5 bg-[#CC9900]/20 border border-[#CC9900]/40 rounded-lg text-[#CC9900] font-mono text-sm font-bold">
                        Ctrl
                      </kbd>
                      <span className="text-white/40">+</span>
                      <kbd className="px-3 py-1.5 bg-[#CC9900]/20 border border-[#CC9900]/40 rounded-lg text-[#CC9900] font-mono text-sm font-bold">
                        V
                      </kbd>
                    </div>
                    <p className="text-white/50 text-center text-xs mt-3">
                      oppure tieni premuto e seleziona "Incolla"
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
