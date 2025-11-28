import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Star, Gift, ExternalLink, Sparkles } from "lucide-react";
import { CopySuccessModal } from "@/components/CopySuccessModal";
import { motion, AnimatePresence } from "framer-motion";

// Mappa caratteri per stile Bold matematico (per il testo)
const boldMap: Record<string, string> = {
  'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
  'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
  'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
  'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣',
  'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭',
  'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
  ' ': ' ', ':': ':', '-': '–'
};

// Mappa caratteri fancy per il codice (mix di stili)
const fancyCodeMap: Record<string, string> = {
  'T': '𝐓', 'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ',
  'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖',
  'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ',
  '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡',
  '-': '–'
};

// Converte testo in Bold matematico
function toBold(text: string): string {
  return text.split('').map(c => boldMap[c] || c).join('');
}

// Converte codice in stile fancy
function toFancyCode(code: string): string {
  return code.split('').map(c => fancyCodeMap[c] || c).join('');
}

// Genera codice TapTrust univoco nel formato TT-XXXX-XX
function generateTTCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `TT-${part1}-${part2}`;
}

// Formatta il codice per la copia con caratteri di lusso
function formatCodeForCopy(code: string): string {
  const fancyLabel = toBold('TapTrust Verification Key:');
  const fancyCode = toFancyCode(code);
  return `\n${fancyLabel} ${fancyCode}`;
}

// Icona piattaforma
function getPlatformIcon(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes('google')) return '🔍';
  if (lower.includes('tripadvisor')) return '🦉';
  if (lower.includes('facebook')) return '📘';
  if (lower.includes('yelp')) return '⭐';
  if (lower.includes('trustpilot')) return '💚';
  return '⭐';
}

export default function PublicProfile() {
  const params = useParams() as { username: string };
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingLinkId, setPendingLinkId] = useState<number | null>(null);
  
  // Genera il codice una sola volta per sessione
  const ttCode = useMemo(() => generateTTCode(), []);
  
  const { data, isLoading, error } = useQuery<{
    profile: { displayName?: string; bio?: string; avatarUrl?: string; accentColor?: string };
    user: { username: string };
    links: Array<{ id: number; title: string; url: string }>;
  }>({
    queryKey: ["/api/public", params.username],
    enabled: !!params.username,
  });

  // Query per promozioni attive
  const { data: promos } = useQuery<Array<{
    id: number;
    title: string;
    description: string;
    discountType: string;
    discountValue: number;
    expiresAt: string;
  }>>({
    queryKey: ["/api/public", params.username, "promotions"],
    enabled: !!params.username,
  });

  // Chiudi modal e apri link
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    if (pendingLinkId !== null) {
      window.open(`/r/${params.username}/${pendingLinkId}?ttcode=${ttCode}`, '_blank');
      setPendingLinkId(null);
    }
  }, [pendingLinkId, params.username, ttCode]);

  // Copia il codice e mostra modal
  const handleLinkClick = async (e: React.MouseEvent, linkId: number) => {
    e.preventDefault();
    
    try {
      const fullCode = formatCodeForCopy(ttCode);
      await navigator.clipboard.writeText(fullCode);
      setCopied(true);
      setPendingLinkId(linkId);
      setShowModal(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Errore",
        description: "Non è stato possibile copiare il codice",
        variant: "destructive",
      });
      window.open(`/r/${params.username}/${linkId}?ttcode=${ttCode}`, '_blank');
    }
  };

  // Loading state con skeleton luxury
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#CC9900]/20 via-[#CC9900]/10 to-[#CC9900]/20 rounded-3xl blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border border-[#CC9900]/20">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[#CC9900]/20 animate-pulse" />
              </div>
              <div className="h-8 bg-[#CC9900]/10 rounded-lg w-48 mx-auto mb-3 animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-64 mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#CC9900]/10 flex items-center justify-center">
            <span className="text-4xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold mb-3 text-white" data-testid="text-error-title">
            Pagina non trovata
          </h1>
          <p className="text-white/50 mb-8 max-w-xs mx-auto">
            Il profilo che stai cercando non esiste o non è più disponibile.
          </p>
          <Button 
            onClick={() => setLocation("/")} 
            className="bg-[#CC9900] hover:bg-[#d4af37] text-black font-semibold px-8"
            data-testid="button-home"
          >
            Torna alla Home
          </Button>
        </motion.div>
      </div>
    );
  }

  const { profile, user, links } = data;
  const displayName = profile.displayName || user.username;
  const firstLetter = displayName.charAt(0).toUpperCase();
  const hasPromos = promos && promos.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-6">
      {/* Background pattern sottile */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(#CC9900 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card principale con glow */}
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute -inset-[2px] bg-gradient-to-b from-[#CC9900]/30 via-[#CC9900]/10 to-transparent rounded-[28px] blur-sm" />
          
          {/* Main card */}
          <div className="relative bg-gradient-to-b from-[#151515] via-[#111111] to-[#0a0a0a] rounded-3xl overflow-hidden border border-[#CC9900]/20 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)]">
            
            {/* Header decorativo */}
            <div className="h-24 bg-gradient-to-br from-[#CC9900]/20 via-[#CC9900]/5 to-transparent relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNDQzk5MDAiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
              <Sparkles className="absolute top-4 right-4 w-5 h-5 text-[#CC9900]/30" />
            </div>
            
            {/* Avatar con halo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center -mt-14 relative z-10"
            >
              <div className="relative">
                {/* Halo glow */}
                <div className="absolute -inset-2 bg-gradient-to-b from-[#CC9900]/40 to-[#CC9900]/10 rounded-full blur-md" />
                <div className="absolute -inset-1 bg-gradient-to-b from-[#CC9900] to-[#996600] rounded-full opacity-80" />
                
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="relative w-24 h-24 rounded-full object-cover border-4 border-[#0a0a0a]"
                    data-testid="img-avatar"
                  />
                ) : (
                  <div
                    className="relative w-24 h-24 bg-gradient-to-br from-[#CC9900] to-[#997700] rounded-full flex items-center justify-center border-4 border-[#0a0a0a]"
                    data-testid="div-avatar-placeholder"
                  >
                    <span className="text-black text-3xl font-bold">{firstLetter}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="px-6 pb-8 pt-5">
              {/* Nome e bio */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <h1
                  className="text-[#CC9900] text-2xl sm:text-3xl font-bold tracking-tight"
                  data-testid="text-display-name"
                >
                  {displayName}
                </h1>
                {profile.bio && (
                  <p className="text-white/60 text-sm mt-2 max-w-xs mx-auto leading-relaxed" data-testid="text-bio">
                    {profile.bio}
                  </p>
                )}
              </motion.div>

              {/* Sezione Codice TapTrust - Glassmorphism */}
              {links.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <div className="relative group">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#CC9900]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl overflow-hidden" />
                    
                    <div className="relative bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#CC9900]/30 rounded-2xl p-5">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-[#CC9900]" />
                        <span className="text-xs font-medium text-[#CC9900] uppercase tracking-widest">
                          Codice Verifica
                        </span>
                        <Star className="w-4 h-4 text-[#CC9900]" />
                      </div>
                      
                      <p className="text-white/70 text-xs text-center mb-4 leading-relaxed">
                        Includi questo codice nella tua recensione per certificarla come autentica
                      </p>
                      
                      <div className="flex items-center justify-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#CC9900]/20 rounded-xl blur-sm" />
                          <span 
                            className="relative font-mono text-xl font-bold text-[#CC9900] bg-[#151515] px-5 py-3 rounded-xl border border-[#CC9900]/40 inline-block"
                            data-testid="text-tt-code"
                          >
                            {ttCode}
                          </span>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            const fullCode = formatCodeForCopy(ttCode);
                            await navigator.clipboard.writeText(fullCode);
                            setCopied(true);
                            setPendingLinkId(null);
                            setShowModal(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="p-3 bg-gradient-to-br from-[#CC9900] to-[#997700] hover:from-[#d4af37] hover:to-[#CC9900] rounded-xl text-black transition-all shadow-lg shadow-[#CC9900]/20"
                          data-testid="button-copy-code"
                        >
                          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </motion.button>
                      </div>
                      
                      <p className="text-white/40 text-[10px] text-center mt-3 uppercase tracking-wider">
                        Il codice viene copiato automaticamente
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Sezione Link Recensioni */}
              {links.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#CC9900]/30 to-transparent" />
                    <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest px-2">
                      Lascia una Recensione
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#CC9900]/30 to-transparent" />
                  </div>
                  
                  <div className="space-y-3">
                    {links.map((link: any, index: number) => (
                      <motion.button
                        key={link.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => handleLinkClick(e, link.id)}
                        className="w-full p-4 bg-gradient-to-r from-[#1a1a1a] to-[#151515] hover:from-[#1f1f1f] hover:to-[#1a1a1a] rounded-xl border border-white/10 hover:border-[#CC9900]/40 transition-all duration-300 flex items-center gap-4 group"
                        data-testid={`link-${link.id}`}
                      >
                        <span className="text-2xl">{getPlatformIcon(link.title)}</span>
                        <span className="flex-1 text-left font-medium text-white/90 group-hover:text-white">
                          {link.title}
                        </span>
                        <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[#CC9900] transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Sezione Promozioni Attive */}
              {hasPromos && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#CC9900]/30 to-transparent" />
                    <span className="text-[10px] font-medium text-[#CC9900] uppercase tracking-widest px-2 flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      Promozioni Attive
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#CC9900]/30 to-transparent" />
                  </div>
                  
                  <div className="space-y-3">
                    {promos!.map((promo, index) => (
                      <motion.div
                        key={promo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="relative group cursor-pointer"
                        onClick={() => setLocation(`/promo/${params.username}/${promo.id}`)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#CC9900]/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-4 bg-[#0f0f0f] border border-[#CC9900]/20 rounded-xl">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-white/90 mb-1">{promo.title}</h3>
                              <p className="text-xs text-white/50 line-clamp-2">{promo.description}</p>
                            </div>
                            <div className="bg-gradient-to-br from-[#CC9900] to-[#997700] text-black text-xs font-bold px-3 py-1.5 rounded-lg">
                              {promo.discountType === 'percentage' 
                                ? `-${promo.discountValue}%` 
                                : `€${promo.discountValue}`}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Nessun link */}
              {links.length === 0 && !hasPromos && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <Star className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-white/40" data-testid="text-no-links">
                    Nessun contenuto disponibile
                  </p>
                </div>
              )}

              {/* Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center mt-10 pt-6 border-t border-white/5"
              >
                <button
                  onClick={() => setLocation("/")}
                  className="text-white/30 text-xs hover:text-[#CC9900] transition-colors inline-flex items-center gap-1"
                  data-testid="link-powered-by"
                >
                  Powered by <span className="text-[#CC9900] font-medium">TapTrust</span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal di conferma copia */}
      <CopySuccessModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        code={ttCode} 
      />
    </div>
  );
}
