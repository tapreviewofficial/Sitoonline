import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Copy, Check, AlertTriangle } from "lucide-react";
import { CopySuccessModal } from "@/components/CopySuccessModal";

function formatCodeForCopy(code: string): string {
  return `\n\n𝗩𝗘𝗥𝗜𝗙𝗜𝗘𝗗 𝗩𝗜𝗦𝗜𝗧 – Recensione Autentica — by TapTrust • ${code}`;
}

// LocalStorage key per salvare codice e scadenza
const STORAGE_KEY = 'taptrust_review_code';

interface StoredCode {
  code: string;
  expiresAt: string;
  username: string;
}

function getStoredCode(username: string): StoredCode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed: StoredCode = JSON.parse(stored);
    if (parsed.username !== username) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCode(username: string, code: string, expiresAt: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ code, expiresAt, username }));
}

function isCodeExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

export default function PublicProfile() {
  const params = useParams() as { username: string };
  const [, setLocation] = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasShownPopup = useRef(false);
  
  // Check if this is a tap (NFC) visit
  const isTap = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tap') === '1';
  }, []);
  
  // Get stored code from localStorage
  const storedCode = useMemo(() => getStoredCode(params.username), [params.username]);
  const storedCodeValid = storedCode && !isCodeExpired(storedCode.expiresAt);
  
  // Only call API with ?tap=1 if it's a tap visit
  const { data, isLoading, error } = useQuery<{
    profile: { displayName?: string; bio?: string; avatarUrl?: string; accentColor?: string };
    user: { username: string };
    links: Array<{ id: number; title: string; url: string }>;
    reviewCode: string | null;
    expiresAt: string | null;
    isTap: boolean;
  }>({
    queryKey: ["/api/public", params.username, isTap ? 'tap' : 'view'],
    queryFn: async () => {
      const url = isTap 
        ? `/api/public/${params.username}?tap=1`
        : `/api/public/${params.username}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: !!params.username,
  });

  // Determine which code to show
  const reviewCode = useMemo(() => {
    // If API returned a new code (from tap), save it and use it
    if (data?.reviewCode && data?.expiresAt) {
      saveCode(params.username, data.reviewCode, data.expiresAt);
      return data.reviewCode;
    }
    // If we have a valid stored code, use it
    if (storedCodeValid) {
      return storedCode.code;
    }
    return '';
  }, [data?.reviewCode, data?.expiresAt, storedCodeValid, storedCode?.code, params.username]);
  
  const codeExpired = storedCode && isCodeExpired(storedCode.expiresAt) && !data?.reviewCode;

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Popup si apre automaticamente quando c'è un nuovo codice da tap
  useEffect(() => {
    if (data?.profile && reviewCode && !codeExpired && !hasShownPopup.current) {
      hasShownPopup.current = true;
      
      // Tenta copia codice negli appunti
      const fullCode = formatCodeForCopy(reviewCode);
      navigator.clipboard.writeText(fullCode).catch(() => {});
      
      // Mostra popup solo se è un tap o se abbiamo un codice valido
      if (isTap || storedCodeValid) {
        setShowModal(true);
        
        // Chiudi popup dopo 3.8 secondi
        const timer = setTimeout(() => {
          setShowModal(false);
        }, 3800);
        
        return () => clearTimeout(timer);
      }
    }
  }, [data?.profile, reviewCode, codeExpired, isTap, storedCodeValid]);

  const handleLinkClick = (e: React.MouseEvent, linkId: number) => {
    e.preventDefault();
    const linkUrl = `/r/${params.username}/${linkId}?ttcode=${reviewCode}`;
    window.open(linkUrl, '_blank');
  };

  const handleCopyCode = async () => {
    const fullCode = formatCodeForCopy(reviewCode);
    try {
      await navigator.clipboard.writeText(fullCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#CC9900] border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      {/* Glass Card Container */}
      <div className="w-full max-w-md">
        <div 
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(204, 153, 0, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255,255,255,0.1)'
          }}
        >
          {/* Top gold line accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CC9900] to-transparent" />
          
          <div className="p-8">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-[#CC9900]/50"
                  data-testid="img-avatar"
                />
              ) : (
                <div
                  className="w-24 h-24 bg-gradient-to-br from-[#CC9900] to-[#997700] rounded-full flex items-center justify-center"
                  data-testid="div-avatar-placeholder"
                >
                  <span className="text-black text-3xl font-semibold">{firstLetter}</span>
                </div>
              )}
            </div>

            {/* Nome */}
            <div className="text-center mb-8">
              <h1 className="text-white text-2xl font-semibold" data-testid="text-display-name">
                {displayName}
              </h1>
              {profile.bio && (
                <p className="text-white/50 mt-2 text-sm" data-testid="text-bio">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

            {/* Links */}
            <div className="space-y-3">
              {links.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/40" data-testid="text-no-links">
                    Nessun link disponibile
                  </p>
                </div>
              ) : (
                links.map((link: any) => (
                  <button
                    key={link.id}
                    onClick={(e) => handleLinkClick(e, link.id)}
                    className="w-full py-4 px-5 rounded-xl transition-all duration-300 flex items-center justify-between group"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(204, 153, 0, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(204, 153, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
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

            {/* Codice verifica - piccolo e discreto */}
            {reviewCode && !codeExpired && (
              <button
                onClick={handleCopyCode}
                className="mt-6 mx-auto flex items-center gap-2 text-white/30 hover:text-[#CC9900] transition-colors text-xs"
                data-testid="button-copy-code"
              >
                <span className="font-mono">{reviewCode}</span>
                {copied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
            
            {/* Messaggio codice scaduto */}
            {codeExpired && (
              <div className="mt-6 mx-auto flex items-center gap-2 text-amber-500/70 text-xs" data-testid="text-code-expired">
                <AlertTriangle className="w-3 h-3" />
                <span>Codice scaduto - fai un nuovo tap</span>
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => setLocation("/")}
                className="text-white/30 text-xs hover:text-[#CC9900] transition-colors"
                data-testid="link-powered-by"
              >
                Powered by <span className="text-[#CC9900]">TapTrust</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CopySuccessModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        code={reviewCode}
      />
    </div>
  );
}
