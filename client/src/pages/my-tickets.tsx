import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, QrCode, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { useLocation } from "wouter";
import QRCodeReact from "qrcode.react";

interface Ticket {
  id: number;
  code: string;
  qrUrl: string;
  status: string;
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
    const canvas = document.getElementById(`qr-${code}`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `taptrust-qr-${code}.png`;
      link.href = url;
      link.click();
    }
  };

  const getStatusBadge = (status: string, usedAt: string | null, expiresAt: string | null) => {
    const now = new Date();
    const expired = expiresAt && new Date(expiresAt) < now;

    if (status === "USED" || usedAt) {
      return <Badge variant="secondary" className="bg-green-950/50 text-green-400 border-green-800"><CheckCircle className="w-3 h-3 mr-1" />Utilizzato</Badge>;
    }
    if (expired) {
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
            const isActive = ticket.status === "ACTIVE" && !ticket.usedAt && (!ticket.expiresAt || new Date(ticket.expiresAt) > new Date());

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
                    {getStatusBadge(ticket.status, ticket.usedAt, ticket.expiresAt)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* QR Code */}
                  <div className={`bg-white p-4 rounded-lg flex items-center justify-center ${!isActive && 'grayscale'}`}>
                    <QRCodeReact
                      id={`qr-${ticket.code}`}
                      value={ticket.qrUrl}
                      size={180}
                      level="M"
                      fgColor={isActive ? "#d4af37" : "#666666"}
                      bgColor="#ffffff"
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
