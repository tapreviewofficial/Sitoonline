import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, ChevronRight } from "lucide-react";
import { CopySuccessModal } from "@/components/CopySuccessModal";

// Mappa caratteri per stile Bold matematico
const boldMap: Record<string, string> = {
  'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
  'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
  'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
  'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣',
  'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭',
  'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
  ' ': ' ', ':': ':', '-': '–'
};

// Mappa caratteri fancy per il codice
const fancyCodeMap: Record<string, string> = {
  'T': '𝐓', 'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ',
  'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖',
  'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ',
  '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡',
  '-': '–'
};

function toBold(text: string): string {
  return text.split('').map(c => boldMap[c] || c).join('');
}

function toFancyCode(code: string): string {
  return code.split('').map(c => fancyCodeMap[c] || c).join('');
}

function generateTTCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `TT-${part1}-${part2}`;
}

function formatCodeForCopy(code: string): string {
  const fancyLabel = toBold('TapTrust Verification Key:');
  const fancyCode = toFancyCode(code);
  return `\n${fancyLabel} ${fancyCode}`;
}

export default function PublicProfile() {
  const params = useParams() as { username: string };
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingLinkId, setPendingLinkId] = useState<number | null>(null);
  
  const ttCode = useMemo(() => generateTTCode(), []);
  
  const { data, isLoading, error } = useQuery<{
    profile: { displayName?: string; bio?: string; avatarUrl?: string; accentColor?: string };
    user: { username: string };
    links: Array<{ id: number; title: string; url: string }>;
  }>({
    queryKey: ["/api/public", params.username],
    enabled: !!params.username,
  });

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    if (pendingLinkId !== null) {
      window.open(`/r/${params.username}/${pendingLinkId}?ttcode=${ttCode}`, '_blank');
      setPendingLinkId(null);
    }
  }, [pendingLinkId, params.username, ttCode]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-[#CC9900] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-3" data-testid="text-error-title">
            Pagina non trovata
          </h1>
          <p className="text-white/40 mb-8">
            Il profilo richiesto non esiste.
          </p>
          <Button 
            onClick={() => setLocation("/")} 
            className="bg-[#CC9900] hover:bg-[#b8860b] text-black font-medium"
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
    <div className="min-h-screen bg-black">
      <div className="max-w-lg mx-auto px-6 py-12">
        
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={displayName}
              className="w-28 h-28 rounded-full object-cover ring-2 ring-[#CC9900]"
              data-testid="img-avatar"
            />
          ) : (
            <div
              className="w-28 h-28 bg-[#CC9900] rounded-full flex items-center justify-center"
              data-testid="div-avatar-placeholder"
            >
              <span className="text-black text-4xl font-semibold">{firstLetter}</span>
            </div>
          )}
        </div>

        {/* Nome */}
        <div className="text-center mb-10">
          <h1 className="text-white text-3xl font-semibold tracking-tight" data-testid="text-display-name">
            {displayName}
          </h1>
          {profile.bio && (
            <p className="text-white/50 mt-3 text-base" data-testid="text-bio">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Codice Verifica */}
        {links.length > 0 && (
          <div className="mb-10">
            <div className="border border-[#CC9900]/30 rounded-2xl p-6 bg-[#CC9900]/5">
              <p className="text-white/60 text-sm text-center mb-4">
                Il tuo codice di verifica TapTrust
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <span 
                  className="font-mono text-2xl font-bold text-[#CC9900] tracking-wider"
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
                  className="w-10 h-10 bg-[#CC9900] hover:bg-[#b8860b] rounded-full flex items-center justify-center transition-colors"
                  data-testid="button-copy-code"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-black" />
                  ) : (
                    <Copy className="w-5 h-5 text-black" />
                  )}
                </button>
              </div>
              
              <p className="text-white/40 text-xs text-center mt-4">
                Incolla questo codice nella tua recensione
              </p>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="space-y-3">
          {links.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40" data-testid="text-no-links">
                Nessun link disponibile
              </p>
            </div>
          ) : (
            links.map((link: any) => (
              <button
                key={link.id}
                onClick={(e) => handleLinkClick(e, link.id)}
                className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#CC9900]/50 rounded-xl transition-all duration-200 flex items-center justify-between group"
                data-testid={`link-${link.id}`}
              >
                <span className="text-white font-medium">
                  {link.title}
                </span>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-[#CC9900] transition-colors" />
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <button
            onClick={() => setLocation("/")}
            className="text-white/20 text-xs hover:text-[#CC9900] transition-colors"
            data-testid="link-powered-by"
          >
            Powered by <span className="text-[#CC9900]">TapTrust</span>
          </button>
        </div>
      </div>

      <CopySuccessModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        code={ttCode} 
      />
    </div>
  );
}
