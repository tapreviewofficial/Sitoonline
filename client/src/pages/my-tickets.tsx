import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, QrCode, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { useLocation } from "wouter";
import { QRCodeSVG } from "qrcode.react";

interface Ticket {
  id: number;
  code: string;
  qrUrl: string;
  status: string;
  effectiveStatus?: string; // Server-calculated status (ACTIVE/USED/EXPIRED)
  customerName: string | null;
  customerSurname: string | null;
  customerEmail: string;
  usedAt: string | null;
  createdAt: string;
  expiresAt: string | null;
  promo: {
    id: number;
    title: string;
    description: string | null;
    type: string;
  };
}

export default function MyTickets() {
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery<{ tickets: Ticket[] }>({
    queryKey: ["/api/tickets"],
  });

  const downloadQR = (code: string, qrUrl: string) => {
    const svg = document.querySelector(`[data-qr-code="${code}"]`);
    if (svg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `taptrust-qr-${code}.png`;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const getStatusBadge = (ticket: Ticket) => {
    // Usa effectiveStatus se disponibile (server-calculated), altrimenti calcola lato client
    const effectiveStatus = ticket.effectiveStatus || ticket.status;
    const now = new Date();
    const expired = ticket.expiresAt && new Date(ticket.expiresAt) < now;

    if (effectiveStatus === "USED" || ticket.usedAt) {
      return <Badge variant="secondary" className="bg-green-950/50 text-green-400 border-green-800"><CheckCircle className="w-3 h-3 mr-1" />Utilizzato</Badge>;
    }
    if (effectiveStatus === "EXPIRED" || (effectiveStatus === "ACTIVE" && expired)) {
      return <Badge variant="secondary" className="bg-red-950/50 text-red-400 border-red-800"><XCircle className="w-3 h-3 mr-1" />Scaduto</Badge>;
    }
    return <Badge variant="secondary" className="bg-yellow-950/50 text-yellow-400 border-yellow-800"><Clock className="w-3 h-3 mr-1" />Attivo</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64" />)}
          </div>
        </div>
      </div>
    );
  }

  const tickets = data?.tickets || [];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dashboard")}
            className="text-gold hover:bg-gold/10"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gold" data-testid="text-page-title">I Miei QR Code</h1>
            <p className="text-gray-400 mt-1" data-testid="text-page-description">
              Tutti i QR code generati dalle tue promozioni
            </p>
          </div>
        </div>

        {/* Empty State */}
        {tickets.length === 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12 text-center">
              <QrCode className="w-16 h-16 mx-auto mb-4 text-gold opacity-50" />
              <h3 className="text-xl font-semibold mb-2" data-testid="text-empty-title">Nessun QR Code</h3>
              <p className="text-gray-400" data-testid="text-empty-description">
                I QR code generati dalle tue promozioni appariranno qui.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tickets Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => {
            // Calcola effectiveStatus: usa server se disponibile, altrimenti calcola lato client
            let effectiveStatus = ticket.effectiveStatus;
            if (!effectiveStatus) {
              const expired = ticket.expiresAt && new Date(ticket.expiresAt) < new Date();
              effectiveStatus = ticket.usedAt ? "USED" : (expired ? "EXPIRED" : ticket.status);
            }
            const isActive = effectiveStatus === "ACTIVE";

            return (
              <Card 
                key={ticket.id} 
                className={`bg-zinc-900 border-zinc-800 overflow-hidden transition-all ${
                  isActive ? 'hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10' : 'opacity-60'
                }`}
                data-testid={`card-ticket-${ticket.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-gold truncate" data-testid={`text-promo-title-${ticket.id}`}>
                        {ticket.promo.title}
                      </CardTitle>
                      <CardDescription className="mt-1" data-testid={`text-customer-email-${ticket.id}`}>
                        {ticket.customerEmail}
                      </CardDescription>
                    </div>
                    {getStatusBadge(ticket)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* QR Code */}
                  <div className={`bg-white p-4 rounded-lg flex items-center justify-center ${!isActive && 'grayscale'}`}>
                    <QRCodeSVG
                      value={ticket.qrUrl}
                      size={180}
                      level="M"
                      fgColor={isActive ? "#d4af37" : "#666666"}
                      bgColor="#ffffff"
                      data-qr-code={ticket.code}
                    />
                  </div>

                  {/* Code */}
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Codice</div>
                    <div className="font-mono text-lg font-bold text-gold tracking-wider" data-testid={`text-ticket-code-${ticket.id}`}>
                      {ticket.code}
                    </div>
                  </div>

                  {/* Customer Name */}
                  {(ticket.customerName || ticket.customerSurname) && (
                    <div className="text-sm text-gray-400 text-center" data-testid={`text-customer-name-${ticket.id}`}>
                      {ticket.customerName} {ticket.customerSurname}
                    </div>
                  )}

                  {/* Expiry / Used Date */}
                  {ticket.usedAt && (
                    <div className="text-xs text-gray-500 text-center" data-testid={`text-used-at-${ticket.id}`}>
                      Utilizzato il {new Date(ticket.usedAt).toLocaleDateString('it-IT')}
                    </div>
                  )}
                  {!ticket.usedAt && ticket.expiresAt && (
                    <div className="text-xs text-gray-500 text-center" data-testid={`text-expires-at-${ticket.id}`}>
                      Scade il {new Date(ticket.expiresAt).toLocaleDateString('it-IT')}
                    </div>
                  )}

                  {/* Actions */}
                  {isActive && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gold/30 text-gold hover:bg-gold/10"
                        onClick={() => downloadQR(ticket.code, ticket.qrUrl)}
                        data-testid={`button-download-${ticket.id}`}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Scarica
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gold/30 text-gold hover:bg-gold/10"
                        onClick={() => window.open(ticket.qrUrl, '_blank')}
                        data-testid={`button-view-${ticket.id}`}
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        Visualizza
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
