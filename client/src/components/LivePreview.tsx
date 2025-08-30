import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PreviewData {
  profile: {
    displayName: string;
    bio: string;
    avatarUrl: string | null;
    accentColor: string;
  };
  user: {
    username: string;
  };
  links: Array<{
    id: number;
    title: string;
    url: string;
  }>;
}

interface LivePreviewProps {
  username: string;
}

export function LivePreview({ username }: LivePreviewProps) {
  const { data, isLoading } = useQuery<PreviewData>({
    queryKey: ["/api/public", username],
  });

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-8">
          <div className="text-center text-white/60">Caricamento anteprima...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="py-8">
          <div className="text-center text-white/60">Errore nel caricamento dell'anteprima</div>
        </CardContent>
      </Card>
    );
  }

  const { profile, user, links } = data;
  const accentColor = profile.accentColor || "#CC9900";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Anteprima Live</h2>
        <Button
          onClick={() => window.open(`/u/${username}`, '_blank')}
          className="bg-[#CC9900] hover:bg-[#CC9900]/80 text-black"
          data-testid="button-open-public-page"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Apri Pagina Pubblica
        </Button>
      </div>

      {/* Simulated Mobile Frame */}
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-white/10">
          {/* Profile Header Preview */}
          <div className="text-center mb-6">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName || user.username}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2"
                style={{ borderColor: accentColor }}
                data-testid="preview-avatar"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold text-black border-2"
                style={{ backgroundColor: accentColor, borderColor: accentColor }}
                data-testid="preview-avatar-placeholder"
              >
                {(profile.displayName || user.username).charAt(0).toUpperCase()}
              </div>
            )}
            
            <h1
              className="text-xl font-bold mb-2"
              style={{ color: accentColor }}
              data-testid="preview-display-name"
            >
              {profile.displayName || user.username}
            </h1>
            
            {profile.bio && (
              <p className="text-white/70 text-sm" data-testid="preview-bio">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Links Preview */}
          <div className="space-y-3">
            {links.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-white/50 text-sm">Nessun link disponibile</p>
              </div>
            ) : (
              links.map((link) => (
                <div
                  key={link.id}
                  className="w-full p-3 bg-white/10 rounded-lg border-2 border-white/20 hover:border-opacity-100 transition-colors text-center font-medium text-white cursor-pointer"
                  style={{ borderColor: accentColor + '40', color: 'white' }}
                  data-testid={`preview-link-${link.id}`}
                >
                  {link.title}
                </div>
              ))
            )}
          </div>

          {/* Powered by Preview */}
          <div className="text-center mt-8">
            <p className="text-xs text-white/40">
              Powered by <span className="font-bold text-white/60">TapReview</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}