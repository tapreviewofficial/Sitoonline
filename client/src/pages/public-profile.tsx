import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";

// Genera codice TapTrust univoco
function generateTTCode(): string {
  const num = Math.floor(Math.random() * 9999999).toString().padStart(7, '0');
  return `TT-${num}`;
}

export default function PublicProfile() {
  const params = useParams() as { username: string };
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
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

  // Copia il codice e apre il link
  const handleLinkClick = async (e: React.MouseEvent, linkId: number) => {
    e.preventDefault();
    
    try {
      // Copia il codice negli appunti
      await navigator.clipboard.writeText(ttCode);
      setCopied(true);
      
      toast({
        title: "Codice copiato!",
        description: `Incolla "${ttCode}" nella tua recensione`,
      });
      
      // Reset stato dopo 3 secondi
      setTimeout(() => setCopied(false), 3000);
      
      // Apri il link con il codice per tracciamento (dopo breve delay per mostrare il toast)
      setTimeout(() => {
        window.open(`/r/${params.username}/${linkId}?ttcode=${ttCode}`, '_blank');
      }, 800);
      
    } catch (err) {
      // Fallback se clipboard non funziona
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
                Includi questo codice nella recensione:
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
                    await navigator.clipboard.writeText(ttCode);
                    setCopied(true);
                    toast({ title: "Codice copiato!" });
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
    </div>
  );
}
