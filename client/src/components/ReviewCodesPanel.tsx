import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface ReviewCode {
  id: number;
  code: string;
  userId: number;
  linkId: number | null;
  platform: string | null;
  createdAt: string;
  clickedAt: string | null;
}

export function ReviewCodesPanel() {
  const { data: codes = [], isLoading } = useQuery<ReviewCode[]>({
    queryKey: ["/api/review-codes"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-shield-check text-gold"></i>
            Codici Verifica Recensioni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <i className="fas fa-shield-check text-gold"></i>
          Codici Verifica Recensioni
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">
          Questi codici vengono generati quando i clienti visitano il tuo profilo e cliccano su un link per lasciare una recensione.
          Potranno includerli nella loro recensione per verificare l'autenticità.
        </p>

        {codes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <i className="fas fa-shield-check text-4xl mb-4 opacity-50"></i>
            <p>Nessun codice generato</p>
            <p className="text-sm">I codici appariranno quando i clienti cliccheranno sui tuoi link</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {codes.map((code) => (
              <div
                key={code.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
                data-testid={`review-code-${code.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-lg font-bold text-gold">
                    {code.code}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {code.platform || "Link generico"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={code.clickedAt ? "default" : "secondary"}>
                    {code.clickedAt ? "Usato" : "Generato"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(code.createdAt), "d MMM HH:mm", { locale: it })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 bg-gold/10 rounded-lg border border-gold/20">
          <p className="text-sm text-gold">
            <i className="fas fa-info-circle mr-2"></i>
            Cerca questi codici nelle recensioni dei tuoi clienti per verificare l'autenticità.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
