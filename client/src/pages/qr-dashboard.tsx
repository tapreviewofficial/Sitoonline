import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Gift, Download, QrCode, Filter } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLocation } from "wouter";

interface TicketData {
  id: number;
  code: string;
  qrUrl: string;
  status: string;
  effectiveStatus: string;
  usedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  promo: {
    id: number;
    title: string;
    description: string | null;
    type: string;
  };
}

export default function QRDashboard() {
  const [, setLocation] = useLocation();
  const [filterStatus, setFilterStatus] = useState<"all" | "ACTIVE" | "USED" | "EXPIRED">("all");

  const { data, isLoading } = useQuery<{ tickets: TicketData[] }>({
    queryKey: ["/api/tickets"],
  });

  const tickets = data?.tickets;

  const filteredTickets = tickets?.filter(ticket => {
    if (filterStatus === "all") return true;
    return ticket.effectiveStatus === filterStatus;
  });

  const stats = {
    total: tickets?.length || 0,
    active: tickets?.filter(t => t.effectiveStatus === "ACTIVE").length || 0,
    used: tickets?.filter(t => t.effectiveStatus === "USED").length || 0,
    expired: tickets?.filter(t => t.effectiveStatus === "EXPIRED").length || 0,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Valido</Badge>;
      case "USED":
        return <Badge className="bg-blue-500">Utilizzato</Badge>;
      case "EXPIRED":
        return <Badge className="bg-orange-500">Scaduto</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "USED":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "EXPIRED":
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <XCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

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
        downloadLink.download = `ticket-${code}.png`;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="h-8 bg-muted rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6" data-testid="qr-dashboard">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <QrCode className="h-8 w-8" />
          QR Code Rilasciati
        </h1>
        <p className="text-muted-foreground">
          Gestisci e monitora tutti i QR code promozionali che hai generato
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Totale</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Validi
            </CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              Utilizzati
            </CardDescription>
            <CardTitle className="text-3xl text-blue-500">{stats.used}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-orange-500" />
              Scaduti
            </CardDescription>
            <CardTitle className="text-3xl text-orange-500">{stats.expired}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" data-testid="filter-all">
            Tutti ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="ACTIVE" data-testid="filter-active">
            Validi ({stats.active})
          </TabsTrigger>
          <TabsTrigger value="USED" data-testid="filter-used">
            Utilizzati ({stats.used})
          </TabsTrigger>
          <TabsTrigger value="EXPIRED" data-testid="filter-expired">
            Scaduti ({stats.expired})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filterStatus} className="mt-6">
          {filteredTickets && filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nessun QR code {filterStatus === "all" ? "" : filterStatus === "ACTIVE" ? "valido" : filterStatus === "USED" ? "utilizzato" : "scaduto"} trovato.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTickets?.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden" data-testid={`ticket-card-${ticket.code}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.effectiveStatus)}
                        <CardTitle className="text-lg">{ticket.code}</CardTitle>
                      </div>
                      {getStatusBadge(ticket.effectiveStatus)}
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Gift className="h-3 w-3" />
                      {ticket.promo.title}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* QR Code */}
                    <div className="flex justify-center p-4 bg-white dark:bg-muted rounded-lg">
                      <div className={ticket.effectiveStatus !== "ACTIVE" ? "opacity-40 grayscale" : ""}>
                        <QRCodeSVG
                          value={ticket.qrUrl}
                          size={150}
                          level="M"
                          bgColor="#ffffff"
                          fgColor="#CC9900"
                          data-qr-code={ticket.code}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Creato:</span>
                        <span className="font-medium">
                          {new Date(ticket.createdAt).toLocaleDateString("it-IT")}
                        </span>
                      </div>
                      
                      {ticket.expiresAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Scadenza:</span>
                          <span className="font-medium">
                            {new Date(ticket.expiresAt).toLocaleDateString("it-IT")}
                          </span>
                        </div>
                      )}

                      {ticket.usedAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Utilizzato:</span>
                          <span className="font-medium">
                            {new Date(ticket.usedAt).toLocaleDateString("it-IT")}
                          </span>
                        </div>
                      )}

                      <Badge variant="outline" className="w-full justify-center">
                        {ticket.promo.type}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => downloadQR(ticket.code, ticket.qrUrl)}
                        data-testid={`button-download-${ticket.code}`}
                      >
                        <Download className="h-4 w-4" />
                        Scarica QR
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setLocation(`/q/${ticket.code}`)}
                        data-testid={`button-view-${ticket.code}`}
                      >
                        Visualizza Dettagli
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Back Button */}
      <div className="mt-6">
        <Button variant="outline" onClick={() => setLocation("/dashboard")} data-testid="button-back">
          ← Torna alla Dashboard
        </Button>
      </div>
    </div>
  );
}
