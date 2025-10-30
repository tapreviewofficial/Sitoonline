import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";

export default function Landing() {
  return (
    <div className="min-h-screen bg-coal">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24 bg-gradient-to-b from-coal via-charcoal to-coal">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6" data-testid="text-hero-title">
            Ogni Voce Lascia il Segno
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-4 leading-relaxed">
            TapTrust trasforma ogni opinione in un atto autentico di fiducia. Nessuna app. Nessuna frizione. Solo un tap e la tua reputazione prende vita.
          </p>
          <p className="text-lg md:text-xl font-semibold text-gold mb-12">
            La recensione diventa reputazione. La reputazione diventa valore. Il valore diventa potere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-gold hover:bg-gold/90 text-coal font-bold text-lg px-10 py-6 rounded-lg transition-all hover:scale-105 shadow-xl w-full sm:w-auto" data-testid="button-discover">
                Scopri TapTrust
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-2 border-gold text-gold hover:bg-gold hover:text-coal font-semibold text-lg px-10 py-6 rounded-lg transition-all w-full sm:w-auto" data-testid="button-request-access">
                Richiedi Accesso
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* La Fiducia Non Si Chiede Section */}
      <section className="px-4 py-16 md:py-24 bg-charcoal">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-trust-title">
              La Fiducia Non Si Chiede. Si Conquista.
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              Ogni interazione lascia un segno indelebile. TapTrust rende ogni voce un gesto tangibile di fiducia, creando una connessione autentica tra esperienza vissuta e reputazione costruita.
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Nel mondo del business moderno, la fiducia è la valuta più preziosa. TapTrust la rende visibile, misurabile, impossibile da ignorare.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <Card className="bg-gradient-to-br from-charcoal to-coal border border-warm-gray/20 rounded-2xl p-8 hover:border-gold/40 transition-all hover:shadow-xl">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-gold">Tecnologia NFC Invisibile</h3>
                <p className="text-gray-300 text-lg">Integrata perfettamente nel design, senza compromessi estetici</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-charcoal to-coal border border-warm-gray/20 rounded-2xl p-8 hover:border-gold/40 transition-all hover:shadow-xl">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">✨</div>
                <h3 className="text-2xl font-bold mb-4 text-gold">Estetica Premium</h3>
                <p className="text-gray-300 text-lg">Design minimal e magnetico che comunica esclusività</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-charcoal to-coal border border-warm-gray/20 rounded-2xl p-8 hover:border-gold/40 transition-all hover:shadow-xl">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">✓</div>
                <h3 className="text-2xl font-bold mb-4 text-gold">Autenticità Certificata</h3>
                <p className="text-gray-300 text-lg">Recensioni genuine su Google o Tripadvisor o altre piattaforme, verificate in tempo reale</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-charcoal to-coal border border-warm-gray/20 rounded-2xl p-8 hover:border-gold/40 transition-all hover:shadow-xl">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">📊</div>
                <h3 className="text-2xl font-bold mb-4 text-gold">Trust Index#</h3>
                <p className="text-gray-300 text-lg">Analisi intelligenti che trasformano dati in strategia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Un Gesto. Tre Risultati Section */}
      <section className="px-4 py-16 md:py-24 bg-coal">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" data-testid="text-three-results-title">
            Un Gesto. Tre Risultati.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-gold text-coal w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl mx-auto mb-6">01</div>
              <h3 className="text-2xl font-bold mb-4 text-gold">TAP</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Avvicina lo smartphone alla TapTrust Card. Un movimento naturale, un'interazione senza sforzo. La tecnologia si dissolve nell'esperienza.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold text-coal w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl mx-auto mb-6">02</div>
              <h3 className="text-2xl font-bold mb-4 text-gold">VOCE</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Lascia la tua opinione in pochi secondi. Nessuna registrazione, nessuna complicazione. Solo la purezza dell'esperienza condivisa, autentica e immediata.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold text-coal w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl mx-auto mb-6">03</div>
              <h3 className="text-2xl font-bold mb-4 text-gold">SEGNO</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Ogni voce diventa reputazione reale, tangibile, misurabile. Da ogni tocco nasce fiducia. Da ogni fiducia, una storia che resta per sempre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creato Per Chi Vive di Reputazione Section */}
      <section className="px-4 py-16 md:py-24 bg-charcoal">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" data-testid="text-reputation-title">
            Creato Per Chi Vive di Reputazione
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-coal to-charcoal border border-gold/20 rounded-2xl p-10 hover:shadow-2xl hover:shadow-gold/10 transition-all">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">🍽️</div>
                <h3 className="text-2xl font-bold mb-4 text-gold">Ristoranti & Hotel</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Ogni tavolo diventa un'icona di fiducia. Ogni cliente, un ambasciatore del tuo nome. Trasforma l'ospitalità in reputazione permanente.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-coal to-charcoal border border-gold/20 rounded-2xl p-10 hover:shadow-2xl hover:shadow-gold/10 transition-all">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">👜</div>
                <h3 className="text-2xl font-bold mb-4 text-gold">Brand & Boutique</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Ogni prodotto racconta la tua storia. Ogni acquisto diventa un'esperienza condivisa. Il lusso incontra l'autenticità in ogni interazione.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-coal to-charcoal border border-gold/20 rounded-2xl p-10 hover:shadow-2xl hover:shadow-gold/10 transition-all">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">💆</div>
                <h3 className="text-2xl font-bold mb-4 text-gold">Wellness & Beauty</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Ogni trattamento lascia un'impressione. Ogni testimonianza costruisce il tuo impero del benessere. L'eccellenza che si fa parola.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/register">
              <Button className="bg-gold hover:bg-gold/90 text-coal font-bold text-lg px-10 py-6 rounded-lg transition-all hover:scale-105 shadow-xl" data-testid="button-discover-solutions">
                Scopri le Soluzioni
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dati Reali Section */}
      <section className="px-4 py-16 md:py-24 bg-coal">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-data-title">
                Dati Reali. Reputazione Reale.
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                TapTrust trasforma ogni voce in intelligenza immediata e actionable. Perché chi misura la fiducia, la domina. Ogni dato è un'opportunità, ogni insight una leva di crescita.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                La dashboard in tempo reale ti mette al comando. Il Trust Index# diventa la tua bussola strategica.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-charcoal border-l-4 border-l-gold p-6 text-center">
                <CardContent className="p-0">
                  <div className="text-5xl font-black text-gold mb-2">98%</div>
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Tasso di Autenticità</div>
                  <p className="text-xs text-gray-500 mt-2">Recensioni verificate e certificate</p>
                </CardContent>
              </Card>

              <Card className="bg-charcoal border-l-4 border-l-gold p-6 text-center">
                <CardContent className="p-0">
                  <div className="text-5xl font-black text-gold mb-2">5x</div>
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Incremento Recensioni</div>
                  <p className="text-xs text-gray-500 mt-2">Rispetto ai metodi tradizionali</p>
                </CardContent>
              </Card>

              <Card className="bg-charcoal border-l-4 border-l-gold p-6 text-center">
                <CardContent className="p-0">
                  <div className="text-5xl font-black text-gold mb-2">&lt;10s</div>
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Tempo Medio</div>
                  <p className="text-xs text-gray-500 mt-2">Per lasciare un feedback completo</p>
                </CardContent>
              </Card>

              <Card className="bg-charcoal border-l-4 border-l-gold p-6 text-center">
                <CardContent className="p-0">
                  <div className="text-5xl font-black text-gold mb-2">24/7</div>
                  <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Monitoraggio Continuo</div>
                  <p className="text-xs text-gray-500 mt-2">Reputazione sempre sotto controllo</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <p className="text-center text-lg text-gray-400 mt-12 max-w-4xl mx-auto">
            Conosci ciò che conta. Migliora ciò che vale. La fiducia diventa la tua leva competitiva, il tuo vantaggio strategico inarrestabile.
          </p>
        </div>
      </section>

      {/* TapTrust Elite Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-charcoal via-coal to-charcoal">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-elite-title">
                TapTrust Elite
              </h2>
              <p className="text-2xl text-gold font-semibold mb-8">
                Un invito. Un privilegio. Un simbolo di appartenenza.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                TapTrust Elite è l'esperienza riservata ai brand che non vogliono confondersi. Design esclusivo realizzato da maestri artigiani, materiali preziosi selezionati con cura maniacale, supporto dedicato h24.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Non è una card. È il segno visibile del tuo status, l'emblema della tua eccellenza. Un oggetto che parla prima ancora che tu apra bocca.
              </p>
            </div>
            
            <div className="space-y-4">
              <Card className="bg-coal border border-gold/40 p-6">
                <CardContent className="p-0 flex items-center gap-4">
                  <div className="text-4xl">🎨</div>
                  <div>
                    <h4 className="font-bold text-lg text-gold">Design Personalizzato</h4>
                    <p className="text-gray-400">Creato esclusivamente per te</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-coal border border-gold/40 p-6">
                <CardContent className="p-0 flex items-center gap-4">
                  <div className="text-4xl">💎</div>
                  <div>
                    <h4 className="font-bold text-lg text-gold">Materiali Preziosi</h4>
                    <p className="text-gray-400">Oro, marmo, legni rari</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-coal border border-gold/40 p-6">
                <CardContent className="p-0 flex items-center gap-4">
                  <div className="text-4xl">👤</div>
                  <div>
                    <h4 className="font-bold text-lg text-gold">Consulente Dedicato</h4>
                    <p className="text-gray-400">Strategia e supporto VIP</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-coal border border-gold/40 p-6">
                <CardContent className="p-0 flex items-center gap-4">
                  <div className="text-4xl">🌟</div>
                  <div>
                    <h4 className="font-bold text-lg text-gold">Eventi Esclusivi</h4>
                    <p className="text-gray-400">Network di élite globale</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/register">
              <Button className="bg-gold hover:bg-gold/90 text-coal font-bold text-lg px-10 py-6 rounded-lg transition-all hover:scale-105 shadow-xl" data-testid="button-request-elite">
                Richiedi Accesso Riservato
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tecnologia Invisibile Section */}
      <section className="px-4 py-16 md:py-24 bg-coal">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-tech-title">
            Tecnologia Invisibile. Estetica Perfetta.
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ogni TapTrust Card è un oggetto d'arte destinato a durare. Lucentezza studiata, texture sofisticate e materiali premium che comunicano valore, identità e potere assoluto.
          </p>
        </div>
      </section>

      {/* La Rete Della Fiducia Section */}
      <section className="px-4 py-16 md:py-24 bg-charcoal">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-network-title">
                La Rete Della Fiducia
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Ogni card TapTrust è un nodo in un ecosistema globale di reputazione reale. Un network di brand visionari e persone straordinarie uniti da autenticità, valore condiviso e visione comune.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Non sei solo. Sei parte di una comunità che ridefinisce gli standard, che eleva il concetto stesso di fiducia nel business moderno.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-coal/50 rounded-lg border border-gold/20">
                <div className="text-3xl">🤝</div>
                <p className="text-lg font-semibold text-gray-200">Connessioni Autentiche</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-coal/50 rounded-lg border border-gold/20">
                <div className="text-3xl">📈</div>
                <p className="text-lg font-semibold text-gray-200">Crescita Condivisa</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-coal/50 rounded-lg border border-gold/20">
                <div className="text-3xl">⭐</div>
                <p className="text-lg font-semibold text-gray-200">Eccellenza Collettiva</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-coal/50 rounded-lg border border-gold/20">
                <div className="text-3xl">👑</div>
                <p className="text-lg font-semibold text-gray-200">Network Premium</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/register">
              <Button className="border-2 border-gold text-gold hover:bg-gold hover:text-coal font-semibold text-lg px-10 py-6 rounded-lg transition-all" data-testid="button-join-network">
                Entra nella Rete TapTrust
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-16 md:py-24 bg-coal">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" data-testid="text-pricing-title">
            Scegli il Tuo Livello di Fiducia
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Business Plan */}
            <Card className="bg-charcoal border border-warm-gray/20 rounded-2xl p-10 hover:border-gold/40 transition-all">
              <CardContent className="p-0">
                <h3 className="text-3xl font-bold mb-2">TapTrust Business</h3>
                <div className="text-4xl font-black text-gold mb-6">€9,99<span className="text-xl text-gray-400">/mese</span></div>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  L'ingresso ufficiale nella rete della fiducia. Tutto ciò che serve per raccogliere recensioni autentiche e costruire reputazione tangibile, misurabile, inarrestabile.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span className="text-gray-200">Card personalizzata con il tuo brand</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span className="text-gray-200">Dashboard analytics in tempo reale</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span className="text-gray-200">Trust Index# e notifiche automatiche</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span className="text-gray-200">Supporto dedicato via email e chat</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-gold hover:bg-gold/90 text-coal font-bold text-lg py-6 rounded-lg transition-all hover:scale-105" data-testid="button-business-plan">
                    Attiva Piano Business
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Elite Plan */}
            <Card className="bg-gradient-to-br from-gold/10 to-coal border-2 border-gold rounded-2xl p-10 shadow-2xl shadow-gold/20 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gold text-coal px-4 py-1 rounded-full text-sm font-bold">ELITE</div>
              <CardContent className="p-0">
                <h3 className="text-3xl font-bold mb-2">TapTrust Elite</h3>
                <div className="text-4xl font-black text-gold mb-6">Solo su Invito</div>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Il livello più alto della fiducia. Design personalizzato da maestri artigiani, materiali preziosi selezionati, consulente strategico dedicato, accesso a eventi riservati globali.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span className="text-gray-200">Card in materiali esclusivi premium</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span className="text-gray-200">Design completamente personalizzato</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span className="text-gray-200">Consulente strategico personale h24</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span className="text-gray-200">Accesso eventi network élite</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span className="text-gray-200">Analytics avanzate predittive</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-400 mb-6 italic">
                  Non tutti possono accedervi. Solo chi merita di essere ricordato.
                </p>
                <Link href="/register">
                  <Button className="w-full border-2 border-gold text-gold hover:bg-gold hover:text-coal font-bold text-lg py-6 rounded-lg transition-all" data-testid="button-elite-invite">
                    Richiedi Invito Privato
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-coal via-charcoal to-coal">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6" data-testid="text-final-cta">
            La Tua Reputazione Non Aspetta
          </h2>
          <p className="text-xl text-gray-300 mb-4 leading-relaxed max-w-3xl mx-auto">
            TapTrust è il nuovo linguaggio universale della fiducia. Ogni voce raccolta, un segno indelebile. Ogni segno lasciato, un valore costruito. Ogni valore creato, un impero che resiste al tempo.
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
            Il futuro della reputazione è qui. Tangibile. Misurabile. Inarrestabile. Unisciti ai visionari che hanno già scelto l'eccellenza.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-gold hover:bg-gold/90 text-coal font-bold text-xl px-12 py-7 rounded-lg transition-all hover:scale-105 shadow-xl w-full sm:w-auto" data-testid="button-request-demo">
                Richiedi Demo Gratuita
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-2 border-gold text-gold hover:bg-gold hover:text-coal font-semibold text-xl px-12 py-7 rounded-lg transition-all w-full sm:w-auto" data-testid="button-discover-business">
                Scopri TapTrust Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t border-warm-gray/20 bg-coal">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-gradient-to-br from-gold to-yellow-600"></div>
              <div>
                <div className="text-2xl font-bold text-gold">TAPTRUST</div>
                <div className="text-sm text-gray-400">La Fiducia. Evoluta.</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
              <Link href="/register"><span className="hover:text-gold transition-colors cursor-pointer">Chi Siamo</span></Link>
              <Link href="/register"><span className="hover:text-gold transition-colors cursor-pointer">Privacy</span></Link>
              <Link href="/register"><span className="hover:text-gold transition-colors cursor-pointer">Contatti</span></Link>
              <Link href="/register"><span className="hover:text-gold transition-colors cursor-pointer">Termini</span></Link>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 border-t border-warm-gray/10 pt-6">
            © 2025 TapTrust ✨ Reputazione Tangibile. Tutti i diritti riservati.
          </div>
        </div>
      </footer>
    </div>
  );
}
