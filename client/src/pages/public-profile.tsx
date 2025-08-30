import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PublicProfile() {
  const params = useParams() as { username: string };
  const [, setLocation] = useLocation();
  
  const { data, isLoading, error } = useQuery<{
    profile: { displayName?: string; bio?: string; avatarUrl?: string; accentColor?: string };
    user: { username: string };
    links: Array<{ id: number; title: string; url: string }>;
  }>({
    queryKey: ["api", "public", params.username],
    enabled: !!params.username,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-48 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-64 mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" data-testid="text-error-title">
            Utente non trovato
          </h1>
          <p className="text-muted-foreground mb-8">
            La pagina che stai cercando non esiste.
          </p>
          <Button onClick={() => setLocation("/")} data-testid="button-home">
            Torna alla Home
          </Button>
        </div>
      </div>
    );
  }

  const { profile, user, links } = data;
  const accentColor = profile.accentColor || "#CC9900";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            {/* Avatar */}
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName || user.username}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                data-testid="img-avatar"
              />
            ) : (
              <div
                className="w-24 h-24 bg-gradient-to-br from-gold to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-coal"
                data-testid="div-avatar-placeholder"
              >
                {(profile.displayName || user.username).charAt(0).toUpperCase()}
              </div>
            )}
            
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: accentColor }}
              data-testid="text-display-name"
            >
              {profile.displayName || user.username}
            </h1>
            
            {profile.bio && (
              <p className="text-muted-foreground" data-testid="text-bio">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground" data-testid="text-no-links">
                  Nessun link disponibile
                </p>
              </div>
            ) : (
              links.map((link: any) => (
                <a
                  key={link.id}
                  href={`/r/${user.username}/${link.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-4 bg-card rounded-lg border border-border hover:border-gold transition-colors text-center font-medium"
                  style={{ borderColor: accentColor }}
                  data-testid={`link-${link.id}`}
                >
                  {link.title}
                </a>
              ))
            )}
          </div>

          {/* Powered by */}
          <div className="text-center mt-12">
            <button
              onClick={() => setLocation("/")}
              className="text-sm text-muted-foreground hover:text-gold transition-colors"
              data-testid="link-powered-by"
            >
              Powered by <span className="font-bold">TapReview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
