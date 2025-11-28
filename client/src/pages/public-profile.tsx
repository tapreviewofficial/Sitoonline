import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";
import { CopySuccessModal } from "@/components/CopySuccessModal";

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

// Formatta il codice per la copia con caratteri di lusso (con doppio newline per separazione)
function formatCodeForCopy(code: string): string {
  const fancyLabel = toBold('TapTrust Verification Key:');
  const fancyCode = toFancyCode(code);
  return `\n\n${fancyLabel} ${fancyCode}`;
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
      // Copia il codice completo negli appunti
      const fullCode = formatCodeForCopy(ttCode);
      await navigator.clipboard.writeText(fullCode);
      setCopied(true);
      setPendingLinkId(linkId);
      setShowModal(true);
      
      // Reset stato copied dopo 3 secondi
      setTimeout(() => setCopied(false), 3000);
      
    } catch (err) {
      // Fallback se clipboard non funziona
      toast({
        title: "Errore",
        description: "Non è stato possibile copiare il codice",
        variant: "destructive",
      });
      window.open(`/r/${params.username}/${linkId}?ttcode=${ttCode}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#CC9900]/20 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-white/10 rounded w-48 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded w-64 mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white" data-testid="text-error-title">
            Utente non trovato
          </h1>
          <p className="text-white/60 mb-8">
            La pagina che stai cercando non esiste.
          </p>
          <Button 
            onClick={() => setLocation("/")} 
            className="bg-[#CC9900] hover:bg-[#CC9900]/90 text-black"
            data-testid="button-home"
          >
            Torna alla Home
          </Button>
        </div>
      </div>
    );
  }

  const { profile, user, links } = data;
  const displayName = profile.displayName || user.username;
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-[#1a2332] rounded-xl p-8 shadow-2xl border border-white/10">
          {/* Avatar Circle */}
          <div className="flex justify-center mb-6">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#CC9900]"
                data-testid="img-avatar"
              />
            ) : (
              <div
                className="w-20 h-20 bg-[#CC9900] rounded-full flex items-center justify-center"
                data-testid="div-avatar-placeholder"
              >
                <span className="text-black text-2xl font-bold">{firstLetter}</span>
              </div>
            )}
          </div>

          {/* Business Name */}
          <div className="text-center mb-8">
            <h1
              className="text-[#CC9900] text-2xl font-bold"
              data-testid="text-display-name"
            >
              {displayName}
            </h1>
            {profile.bio && (
              <p className="text-white/70 text-sm mt-2" data-testid="text-bio">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Codice TapTrust */}
          {links.length > 0 && (
            <div className="mb-6 p-4 bg-[#CC9900]/10 border border-[#CC9900]/30 rounded-lg">
              <p className="text-white/80 text-sm text-center mb-2">
                Includi il tuo Codice Univoco per inviare una Recensione Certificata TapTrust
              </p>
              <div className="flex items-center justify-center gap-2">
                <span 
                  className="font-mono text-lg font-bold text-[#CC9900] bg-[#0a0a0a] px-4 py-2 rounded"
                  data-testid="text-tt-code"
                >
                  {ttCode}
                </span>
                <button
                  onClick={async () => {
                    const fullCode = formatCodeForCopy(ttCode);
                    await navigator.clipboard.writeText(fullCode);
                    setCopied(true);
                    setPendingLinkId(null);
                    setShowModal(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-2 bg-[#CC9900] hover:bg-[#CC9900]/80 rounded text-black transition-colors"
                  data-testid="button-copy-code"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-white/50 text-xs text-center mt-2">
                Il codice verrà copiato automaticamente
              </p>
            </div>
          )}

          {/* Links */}
          <div className="space-y-3">
            {links.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/60" data-testid="text-no-links">
                  Nessun link disponibile
                </p>
              </div>
            ) : (
              links.map((link: any) => (
                <button
                  key={link.id}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className="block w-full p-4 bg-[#2a3441] hover:bg-[#334155] rounded-lg border border-white/20 hover:border-[#CC9900]/50 transition-all duration-200 text-center font-medium text-white"
                  data-testid={`link-${link.id}`}
                >
                  {link.title}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-white/10">
            <button
              onClick={() => setLocation("/")}
              className="text-white/40 text-xs hover:text-[#CC9900] transition-colors"
              data-testid="link-powered-by"
            >
              Powered by <span className="text-[#CC9900]">TapTrust</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal di conferma copia */}
      <CopySuccessModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        code={ttCode} 
      />
    </div>
  );
}
