import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Sparkles, Shield, TrendingUp, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Ogni Voce Lascia il Segno */}
      <section className="relative px-4 py-20 md:py-32 bg-gradient-to-b from-white to-pearl">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 text-black" data-testid="text-hero-title">
            Ogni Voce Lascia il Segno
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 max-w-4xl mx-auto mb-6 leading-relaxed">
            TapTrust trasforma ogni opinione in un atto autentico di fiducia. Nessuna app. Nessuna frizione. Solo un tap e la tua reputazione prende vita.
          </p>
          <p className="text-lg md:text-xl font-semibold text-gray-900 mb-12">
            La recensione diventa reputazione. La reputazione diventa valore. Il valore diventa potere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button 
                className="bg-gold hover:bg-gold-dark text-black font-bold text-lg px-10 py-6 rounded-lg transition-all hover:scale-105 shadow-lg w-full sm:w-auto" 
                data-testid="button-discover"
              >
                Scopri TapTrust
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                variant="outline" 
                className="border-2 border-gold text-gold hover:bg-gold hover:text-black font-semibold text-lg px-10 py-6 rounded-lg transition-all w-full sm:w-auto" 
                data-testid="button-request-access"
              >
                Richiedi Accesso
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* La Fiducia Non Si Chiede Section */}
      <section className="px-4 py-20 md:py-24 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black" data-testid="text-trust-title">
              La Fiducia Non Si Chiede. Si Conquista.
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6">
              Ogni interazione lascia un segno indelebile. TapTrust rende ogni voce un gesto tangibile di fiducia, creando una connessione autentica tra esperienza vissuta e reputazione costruita.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nel mondo del business moderno, la fiducia è la valuta più preziosa. TapTrust la rende visibile, misurabile, impossibile da ignorare.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <Card className="bg-gradient-to-br from-pearl to-white border border-gray-200 rounded-2xl p-8 hover:border-gold/50 transition-all hover:shadow-xl">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-black">Tecnologia NFC Invisibile</h3>
                <p className="text-gray-700 text-lg">Integrata perfettamente nel design, senza compromessi estetici</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-pearl to-white border border-gray-200 rounded-2xl p-8 hover:border-gold/50 transition-all hover:shadow-xl">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">✨</div>
                <h3 className="text-2xl font-bold mb-4 text-black">Estetica Premium</h3>
                <p className="text-gray-700 text-lg">Design minimal e magnetico che comunica esclusività</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pearl to-white border border-gray-200 rounded-2xl p-8 hover:border-gold/50 transition-all hover:shadow-xl">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">✓</div>
                <h3 className="text-2xl font-bold mb-4 text-black">Autenticità Certificata</h3>
                <p className="text-gray-700 text-lg">Recensioni genuine su Google o Tripadvisor o altre piattaforme, verificate in tempo reale</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pearl to-white border border-gray-200 rounded-2xl p-8 hover:border-gold/50 transition-all hover:shadow-xl">
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-6">#</div>
                <h3 className="text-2xl font-bold mb-4 text-black">Trust Index™</h3>
                <p className="text-gray-700 text-lg">Analisi intelligenti che trasformano dati in strategia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Un Gesto. Tre Risultati. */}
      <section className="px-4 py-20 md:py-24 bg-pearl">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
            Un Gesto. Tre Risultati.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl font-black mb-4 text-gold">01</div>
              <h3 className="text-2xl font-bold mb-4 text-black">TAP</h3>
              <p className="text-gray-700 leading-relaxed">
                Avvicina lo smartphone alla TapTrust™ Card. Un movimento naturale, un'interazione senza sforzo. La tecnologia si dissolve nell'esperienza.
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl font-black mb-4 text-gold">02</div>
              <h3 className="text-2xl font-bold mb-4 text-black">VOCE</h3>
              <p className="text-gray-700 leading-relaxed">
                Lascia la tua opinione in pochi secondi. Nessuna registrazione, nessuna complicazione. Solo la purezza dell'esperienza condivisa, autentica e immediata.
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl font-black mb-4 text-gold">03</div>
              <h3 className="text-2xl font-bold mb-4 text-black">SEGNO</h3>
              <p className="text-gray-700 leading-relaxed">
                Ogni voce diventa reputazione reale, tangibile, misurabile. Da ogni tocco nasce fiducia. Da ogni fiducia, una storia che resta per sempre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creato Per Chi Vive di Reputazione */}
      <section className="px-4 py-20 md:py-24 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
            Creato Per Chi Vive di Reputazione
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border border-gray-200 rounded-xl p-8 hover:border-gold/50 transition-all">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-3 text-black">Ristoranti & Hotel</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ogni tavolo diventa un'icona di fiducia. Ogni cliente, un ambasciatore del tuo nome. Trasforma l'ospitalità in reputazione permanente.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-xl p-8 hover:border-gold/50 transition-all">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-3 text-black">Brand & Boutique</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ogni prodotto racconta la tua storia. Ogni acquisto diventa un'esperienza condivisa. Il lusso incontra l'autenticità in ogni interazione.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-xl p-8 hover:border-gold/50 transition-all">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-3 text-black">Wellness & Beauty</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ogni trattamento lascia un'impressione. Ogni testimonianza costruisce il tuo impero del benessere. L'eccellenza che si fa parola.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/register">
              <Button className="bg-gold hover:bg-gold-dark text-black font-bold text-lg px-10 py-6 rounded-lg transition-all" data-testid="button-discover-solutions">
                Scopri le Soluzioni
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dati Reali. Reputazione Reale. */}
      <section className="px-4 py-20 md:py-24 bg-pearl">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black">
            Dati Reali. Reputazione Reale.
          </h2>
          
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              TapTrust trasforma ogni voce in intelligenza immediata e actionable. Perché chi misura la fiducia, la domina. Ogni dato è un'opportunità, ogni insight una leva di crescita.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              La dashboard in tempo reale ti mette al comando. Il Trust Index™ diventa la tua bussola strategica.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl font-black mb-3 text-gold">98%</div>
              <h4 className="text-xl font-bold mb-2 text-black">Tasso di Autenticità</h4>
              <p className="text-gray-600">Recensioni verificate e certificate</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-black mb-3 text-gold">5x</div>
              <h4 className="text-xl font-bold mb-2 text-black">Incremento Recensioni</h4>
              <p className="text-gray-600">Rispetto ai metodi tradizionali</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-black mb-3 text-gold">&lt;10s</div>
              <h4 className="text-xl font-bold mb-2 text-black">Tempo Medio</h4>
              <p className="text-gray-600">Per lasciare un feedback completo</p>
            </div>

            <div className="text-center">
              <div className="text-5xl font-black mb-3 text-gold">24/7</div>
              <h4 className="text-xl font-bold mb-2 text-black">Monitoraggio Continuo</h4>
              <p className="text-gray-600">Reputazione sempre sotto controllo</p>
            </div>
          </div>

          <p className="text-center text-gray-700 text-lg max-w-4xl mx-auto">
            Conosci ciò che conta. Migliora ciò che vale. La fiducia diventa la tua leva competitiva, il tuo vantaggio strategico inarrestabile.
          </p>
        </div>
      </section>

      {/* TapTrust Elite */}
      <section className="px-4 py-20 md:py-24 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">TapTrust Elite</h2>
            <p className="text-2xl text-gold mb-4">Un invito. Un privilegio. Un simbolo di appartenenza.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                TapTrust Elite è l'esperienza riservata ai brand che non vogliono confondersi. Design esclusivo realizzato da maestri artigiani, materiali preziosi selezionati con cura maniacale, supporto dedicato h24.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Non è una card. È il segno visibile del tuo status, l'emblema della tua eccellenza. Un oggetto che parla prima ancora che tu apra bocca.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Design Personalizzato</h4>
                  <p className="text-gray-400">Creato esclusivamente per te</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Materiali Preziosi</h4>
                  <p className="text-gray-400">Oro, marmo, legni rari</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Consulente Dedicato</h4>
                  <p className="text-gray-400">Strategia e supporto VIP</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Eventi Esclusivi</h4>
                  <p className="text-gray-400">Network di élite globale</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/register">
              <Button className="bg-gold hover:bg-gold-dark text-black font-bold text-lg px-10 py-6 rounded-lg transition-all" data-testid="button-elite-access">
                Richiedi Accesso Riservato
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tecnologia Invisibile */}
      <section className="px-4 py-20 md:py-24 bg-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black">
            Tecnologia Invisibile. Estetica Perfetta.
          </h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Ogni TapTrust Card è un oggetto d'arte destinato a durare. Lucentezza studiata, texture sofisticate e materiali premium che comunicano valore, identità e potere assoluto.
          </p>
        </div>
      </section>

      {/* La Rete Della Fiducia */}
      <section className="px-4 py-20 md:py-24 bg-pearl">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black">
            La Rete Della Fiducia
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Ogni card TapTrust è un nodo in un ecosistema globale di reputazione reale. Un network di brand visionari e persone straordinarie uniti da autenticità, valore condiviso e visione comune.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Non sei solo. Sei parte di una comunità che ridefinisce gli standard, che eleva il concetto stesso di fiducia nel business moderno.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span className="text-lg text-gray-800">Connessioni Autentiche</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span className="text-lg text-gray-800">Crescita Condivisa</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span className="text-lg text-gray-800">Eccellenza Collettiva</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <span className="text-lg text-gray-800">Network Premium</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/register">
              <Button className="bg-gold hover:bg-gold-dark text-black font-bold text-lg px-10 py-6 rounded-lg transition-all" data-testid="button-network">
                Entra nella Rete TapTrust
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-20 md:py-24 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
            Scegli il Tuo Livello di Fiducia
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-gray-200 rounded-2xl p-8 hover:border-gold transition-all">
              <CardContent className="p-0">
                <h3 className="text-3xl font-bold mb-2 text-black">TapTrust Business</h3>
                <div className="text-4xl font-black mb-6 text-gold">€9,99<span className="text-lg text-gray-600 font-normal">/mese</span></div>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  L'ingresso ufficiale nella rete della fiducia. Tutto ciò che serve per raccogliere recensioni autentiche e costruire reputazione tangibile, misurabile, inarrestabile.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-gold font-bold">✓</span>
                    <span className="text-gray-700">Card personalizzata con il tuo brand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold font-bold">✓</span>
                    <span className="text-gray-700">Dashboard analytics in tempo reale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold font-bold">✓</span>
                    <span className="text-gray-700">Trust Index™ e notifiche automatiche</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold font-bold">✓</span>
                    <span className="text-gray-700">Supporto dedicato via email e chat</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-6 text-lg" data-testid="button-business">
                    Attiva Piano Business
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-gold rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="p-0">
                <h3 className="text-3xl font-bold mb-2 text-black">TapTrust Elite</h3>
                <div className="text-4xl font-black mb-6 text-gold">Solo su Invito</div>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  Il livello più alto della fiducia. Design personalizzato da maestri artigiani, materiali preziosi selezionati, consulente strategico dedicato, accesso a eventi riservati globali.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-gold font-bold">✓</span>
                    <span className="text-gray-700">Card in materiali esclusivi premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold font-bold">✓</span>
                    <span className="text-gray-700">Design completamente personalizzato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold font-bold">✓</span>
                    <span className="text-gray-700">Consulente strategico personale h24</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold font-bold">✓</span>
                    <span className="text-gray-700">Accesso eventi network élite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold font-bold">✓</span>
                    <span className="text-gray-700">Analytics avanzate predittive</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mb-6 italic">
                  Non tutti possono accedervi. Solo chi merita di essere ricordato.
                </p>
                <Link href="/register">
                  <Button variant="outline" className="w-full border-2 border-gold text-gold hover:bg-gold hover:text-black font-bold py-6 text-lg" data-testid="button-elite">
                    Richiedi Invito Privato
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 md:py-32 bg-gradient-to-b from-pearl to-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-black">
            La Tua Reputazione Non Aspetta
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mb-6 leading-relaxed">
            TapTrust è il nuovo linguaggio universale della fiducia. Ogni voce raccolta, un segno indelebile. Ogni segno lasciato, un valore costruito. Ogni valore creato, un impero che resiste al tempo.
          </p>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            Il futuro della reputazione è qui. Tangibile. Misurabile. Inarrestabile. Unisciti ai visionari che hanno già scelto l'eccellenza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-gold hover:bg-gold-dark text-black font-bold text-lg px-10 py-6 rounded-lg transition-all w-full sm:w-auto" data-testid="button-demo">
                Richiedi Demo Gratuita
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-2 border-gold text-gold hover:bg-gold hover:text-black font-semibold text-lg px-10 py-6 rounded-lg transition-all w-full sm:w-auto" data-testid="button-business-footer">
                Scopri TapTrust Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">TAPTRUST</h3>
              <p className="text-gray-400">La Fiducia. Evoluta.</p>
            </div>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-gold transition-colors">Chi Siamo</a>
              <a href="#" className="hover:text-gold transition-colors">Privacy</a>
              <a href="#" className="hover:text-gold transition-colors">Contatti</a>
              <a href="#" className="hover:text-gold transition-colors">Termini</a>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            © 2025 TapTrust™ Reputazione Tangibile. Tutti i diritti riservati.
          </div>
        </div>
      </footer>
    </div>
  );
}
