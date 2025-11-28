import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, ChevronRight } from "lucide-react";
import { CopySuccessModal } from "@/components/CopySuccessModal";

function generateTTCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `TT-${part1}-${part2}`;
}

function formatCodeForCopy(code: string): string {
  return `\nTapTrust Verification Key: ${code}`;
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
        code={ttCode} 
      />
    </div>
  );
}
