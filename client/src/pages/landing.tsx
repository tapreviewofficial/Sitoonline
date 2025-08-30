import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { HeroIllustration } from "@/components/hero-illustration";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight" data-testid="text-hero-title">
                  Le recensioni sono il tuo{" "}
                  <span className="text-gold">biglietto da visita</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground" data-testid="text-hero-subtitle">
                  Noi le trasformiamo nel tuo strumento di crescita.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button className="btn-gold text-lg px-8 py-4" data-testid="button-activate">
                    Attiva TapReview
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" className="text-lg px-8 py-4" data-testid="button-login">
                    Ho già un account
                  </Button>
                </Link>
              </div>
            </div>
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-4 py-16 bg-secondary">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-problem-title">
            Il Problema
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="text-gold text-2xl mb-4">•</div>
                <p>Il 90% dei clienti sceglie un locale basandosi sulle recensioni.</p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="text-gold text-2xl mb-4">•</div>
                <p>Le recensioni sono frammentate (Google, TripAdvisor, TheFork).</p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="text-gold text-2xl mb-4">•</div>
                <p>Molti locali non raccolgono abbastanza recensioni → perdono clienti senza nemmeno saperlo.</p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="text-gold text-2xl mb-4">•</div>
                <p>Cercare recensioni online è lungo: i passanti rinunciano o vanno dai concorrenti.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" data-testid="text-solution-title">
            Soluzione: TapReview
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">🔗</div>
                <p className="text-lg">Trasforma ogni cliente in un recensore in 10 secondi (card NFC premium).</p>
              </CardContent>
            </Card>
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">⭐</div>
                <p className="text-lg">Ti fa crescere recensioni su Google e TripAdvisor in modo esponenziale.</p>
              </CardContent>
            </Card>
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">📱</div>
                <p className="text-lg">Ti dà una pagina multilink elegante con recensioni</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-4 py-16 bg-secondary">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-how-it-works-title">
            Come Funziona
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="bg-gold text-coal w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <p className="text-lg">Il cliente riceve la card TapReview al tavolo o alla cassa.</p>
            </div>
            <div className="flex items-start gap-6">
              <div className="bg-gold text-coal w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <p className="text-lg">Scansiona il NFC → in 10 secondi lascia la recensione.</p>
            </div>
            <div className="flex items-start gap-6">
              <div className="bg-gold text-coal w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <p className="text-lg">La recensione si somma a Google/TripAdvisor.</p>
            </div>
            <div className="flex items-start gap-6">
              <div className="bg-gold text-coal w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
              <p className="text-lg">Ogni recensione in più aumenta la tua visibilità, fiducia e clienti.</p>
            </div>
            <div className="flex items-start gap-6">
              <div className="bg-gold text-coal w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
              <p className="text-lg">I passanti vedono la targhetta TapReview → fiducia immediata → entrano.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-benefits-title">
            Benefici
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="text-2xl mb-4">📈</div>
                <p className="text-lg">Più recensioni = più clienti = più fatturato.</p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="text-2xl mb-4">🏅</div>
                <p className="text-lg">Immagine premium con card e targhetta elegante.</p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="text-2xl mb-4">⏱️</div>
                <p className="text-lg">Zero complicazioni: pronto in 24h, nessuna gestione tecnica.</p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="text-2xl mb-4">🔒</div>
                <p className="text-lg">Differenziazione immediata: chi non ha TapReview appare meno affidabile.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Say Yes Section */}
      <section className="px-4 py-16 bg-secondary">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-why-say-yes-title">
            Perché è impossibile dire di no
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <CardContent className="p-0">
                <p className="text-lg">I tuoi clienti già guardano recensioni → TapReview ti rende più visibile</p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <p className="text-lg">Investimento minimo, ritorno immediato.</p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <p className="text-lg">Effetto "status symbol": se non hai TapReview, sembri indietro rispetto ai concorrenti.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-cta-title">
            Inizia oggi stesso
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="btn-gold text-lg px-8 py-4" data-testid="button-cta-activate">
                Attiva TapReview
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-lg px-8 py-4" data-testid="button-cta-login">
                Ho già un account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-4">
            <p className="text-muted-foreground">Contatti:</p>
            <p>📧 tapreviewofficial@gmail.com</p>
            <p>🌐 www.tapreview.it</p>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 TapReview. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}
