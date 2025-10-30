import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import heroImage from "@assets/Immagine1_1761815394500.png";
import handImage from "@assets/Immagine2_1761815399300.png";
import smartphoneImage from "@assets/Immagine3_1761815404275.png";
import tabletImage from "@assets/Immagine5_1761815410435.png";
import eliteCardImage from "@assets/Immagine6_1761815414787.png";
import packagingImage from "@assets/Immagine7_1761815423327.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Bianco/Beige */}
      <section className="relative px-4 py-16 md:py-24 bg-gradient-to-br from-white via-[#faf8f5] to-[#f5f2ed]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-gray-900" data-testid="text-hero-title">
                Ogni Voce Lascia il Segno
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-4 leading-relaxed">
                TapTrust trasforma ogni opinione in un atto autentico di fiducia. Nessuna app. Nessuna frizione. Solo <strong>un tap</strong> — e la tua reputazione prende vita.
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                La recensione diventa reputazione. La reputazione diventa valore. Il valore diventa potere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button 
                    className="bg-[#C9A054] hover:bg-[#B8904A] text-black font-bold text-base px-8 py-6 rounded-lg transition-all w-full sm:w-auto" 
                    data-testid="button-discover"
                  >
                    Scopri TapTrust
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    variant="outline" 
                    className="border-2 border-[#C9A054] text-[#C9A054] hover:bg-[#C9A054] hover:text-black font-semibold text-base px-8 py-6 rounded-lg transition-all w-full sm:w-auto" 
                    data-testid="button-request-access"
                  >
                    Richiedi Accesso
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img src={heroImage} alt="TapTrust Card" className="w-full max-w-lg rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* La Fiducia Non Si Chiede - Oro */}
      <section className="px-4 py-16 md:py-24 bg-[#C9A054]">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" data-testid="text-trust-title">
                  La Fiducia Non Si Chiede. Si Conquista.
                </h2>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                  Ogni interazione lascia un segno indelebile. TapTrust rende ogni voce un gesto tangibile di fiducia, creando una connessione autentica tra esperienza vissuta e reputazione costruita.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nel mondo del business moderno, la fiducia è la valuta più preziosa. TapTrust la rende visibile, misurabile, impossibile da ignorare.
                </p>
              </div>
              <div className="flex justify-center">
                <img src={handImage} alt="NFC Tap" className="w-full max-w-md rounded-xl" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#f5f2ed] border-none rounded-xl p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Tecnologia NFC Invisibile</h3>
                  <p className="text-gray-700">Integrata perfettamente nel design, senza compromessi estetici</p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#f5f2ed] border-none rounded-xl p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center mb-4">
                    <span className="text-2xl">💎</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Estetica Premium</h3>
                  <p className="text-gray-700">Design minimal e magnetico che comunica esclusività</p>
                </CardContent>
              </Card>

              <Card className="bg-[#f5f2ed] border-none rounded-xl p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center mb-4">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Autenticità Certificata</h3>
                  <p className="text-gray-700">Recensioni genuine su Google o Tripadvisor o altre piattaforme, verificate in tempo reale</p>
                </CardContent>
              </Card>

              <Card className="bg-[#f5f2ed] border-none rounded-xl p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Trust Index™</h3>
                  <p className="text-gray-700">Analisi intelligenti che trasformano dati in strategia</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Un Gesto. Tre Risultati. - Bianco/Beige */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed]">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Un Gesto. Tre Risultati.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div data-testid="section-tap">
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-400" data-testid="number-01">01</span>
                <div className="w-16 h-1 bg-[#C9A054] mt-2"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900" data-testid="title-tap">TAP</h3>
              <p className="text-gray-700 leading-relaxed">
                Avvicina lo smartphone alla TapTrust™ Card. Un movimento naturale, un'interazione senza sforzo. La tecnologia si dissolve nell'esperienza.
              </p>
            </div>

            <div data-testid="section-voce">
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-400" data-testid="number-02">02</span>
                <div className="w-16 h-1 bg-[#C9A054] mt-2"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900" data-testid="title-voce">VOCE</h3>
              <p className="text-gray-700 leading-relaxed">
                Lascia la tua opinione in pochi secondi. Nessuna registrazione, nessuna complicazione. Solo la purezza dell'esperienza condivisa, autentica e immediata.
              </p>
            </div>

            <div data-testid="section-segno">
              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-400" data-testid="number-03">03</span>
                <div className="w-16 h-1 bg-[#C9A054] mt-2"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900" data-testid="title-segno">SEGNO</h3>
              <p className="text-gray-700 leading-relaxed">
                Ogni voce diventa reputazione reale, tangibile, misurabile. Da ogni tocco nasce fiducia. Da ogni fiducia, una storia che resta per sempre.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <img src={smartphoneImage} alt="TapTrust Smartphone" className="max-w-md rounded-xl shadow-xl" data-testid="image-smartphone" />
          </div>
        </div>
      </section>

      {/* Creato Per Chi Vive di Reputazione - Oro */}
      <section className="px-4 py-16 md:py-24 bg-[#C9A054]">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-3xl p-8 md:p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900">
              Creato Per Chi Vive di Reputazione
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Ristoranti & Hotel</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ogni tavolo diventa un'icona di fiducia. Ogni cliente, un ambasciatore del tuo nome. Trasforma l'ospitalità in reputazione permanente.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Brand & Boutique</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ogni prodotto racconta la tua storia. Ogni acquisto diventa un'esperienza condivisa. Il lusso incontra l'autenticità in ogni interazione.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Wellness & Beauty</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ogni trattamento lascia un'impressione. Ogni testimonianza costruisce il tuo impero del benessere. L'eccellenza che si fa parola.
                </p>
              </div>
            </div>

            <div className="text-left">
              <Link href="/register">
                <Button className="bg-[#C9A054] hover:bg-[#B8904A] text-black font-bold text-base px-8 py-5 rounded-lg transition-all" data-testid="button-discover-solutions">
                  Scopri le Soluzioni
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dati Reali. Reputazione Reale. - Bianco */}
      <section className="px-4 py-16 md:py-24 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900">
            Dati Reali. Reputazione Reale.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="flex justify-center">
              <img src={tabletImage} alt="Dashboard Analytics" className="w-full max-w-lg rounded-xl shadow-xl" />
            </div>
            <div>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                TapTrust trasforma ogni voce in intelligenza immediata e actionable. Perché chi misura la fiducia, la domina. Ogni dato è un'opportunità, ogni insight una leva di crescita.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                La dashboard in tempo reale ti mette al comando. Il Trust Index™ diventa la tua bussola strategica.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="text-center" data-testid="stat-autenticita">
              <div className="text-5xl md:text-6xl font-black mb-3 text-gray-900" data-testid="value-98">98%</div>
              <h4 className="text-lg font-bold mb-2 text-gray-900" data-testid="label-autenticita">Tasso di Autenticità</h4>
              <p className="text-gray-600 text-sm">Recensioni verificate e certificate</p>
            </div>

            <div className="text-center" data-testid="stat-incremento">
              <div className="text-5xl md:text-6xl font-black mb-3 text-gray-900" data-testid="value-5x">5x</div>
              <h4 className="text-lg font-bold mb-2 text-gray-900" data-testid="label-incremento">Incremento Recensioni</h4>
              <p className="text-gray-600 text-sm">Rispetto ai metodi tradizionali</p>
            </div>

            <div className="text-center" data-testid="stat-tempo">
              <div className="text-5xl md:text-6xl font-black mb-3 text-gray-900" data-testid="value-10s">&lt;10s</div>
              <h4 className="text-lg font-bold mb-2 text-gray-900" data-testid="label-tempo">Tempo Medio</h4>
              <p className="text-gray-600 text-sm">Per lasciare un feedback completo</p>
            </div>

            <div className="text-center" data-testid="stat-monitoraggio">
              <div className="text-5xl md:text-6xl font-black mb-3 text-gray-900" data-testid="value-247">24/7</div>
              <h4 className="text-lg font-bold mb-2 text-gray-900" data-testid="label-monitoraggio">Monitoraggio Continuo</h4>
              <p className="text-gray-600 text-sm">Reputazione sempre sotto controllo</p>
            </div>
          </div>

          <p className="text-center text-gray-700 text-base max-w-5xl mx-auto leading-relaxed">
            Conosci ciò che conta. Migliora ciò che vale. La fiducia diventa la tua leva competitiva, il tuo vantaggio strategico inarrestabile.
          </p>
        </div>
      </section>

      {/* TapTrust Elite - Bianco */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-white to-[#faf8f5]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">TapTrust Elite</h2>
              <p className="text-xl text-[#C9A054] font-semibold mb-6 border-l-4 border-[#C9A054] pl-4">
                Un invito. Un privilegio. Un simbolo di appartenenza.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                TapTrust Elite è l'esperienza riservata ai brand che non vogliono confondersi. Design esclusivo realizzato da maestri artigiani, materiali preziosi selezionati con cura maniacale, supporto dedicato h24.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Non è una card. È il segno visibile del tuo status, l'emblema della tua eccellenza. Un oggetto che parla prima ancora che tu apra bocca.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#C9A054] rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Design Personalizzato</h4>
                    <p className="text-gray-600 text-sm">Creato esclusivamente per te</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#C9A054] rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Materiali Preziosi</h4>
                    <p className="text-gray-600 text-sm">Oro, marmo, legni rari</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#C9A054] rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Consulente Dedicato</h4>
                    <p className="text-gray-600 text-sm">Strategia e supporto VIP</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#C9A054] rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Eventi Esclusivi</h4>
                    <p className="text-gray-600 text-sm">Network di élite globale</p>
                  </div>
                </div>
              </div>

              <Link href="/register">
                <Button className="bg-[#C9A054] hover:bg-[#B8904A] text-black font-bold text-base px-8 py-5 rounded-lg transition-all" data-testid="button-elite-access">
                  Richiedi Accesso Riservato
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <img src={eliteCardImage} alt="TapTrust Elite Card" className="w-full max-w-md rounded-xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Tecnologia Invisibile - Oro */}
      <section className="px-4 py-16 md:py-24 bg-[#C9A054]">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Tecnologia Invisibile. Estetica Perfetta.
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
              Ogni TapTrust Card è un oggetto d'arte destinato a durare. Lucentezza studiata, texture sofisticate e materiali premium che comunicano valore, identità e potere assoluto.
            </p>
            <div className="flex justify-center">
              <img src={packagingImage} alt="TapTrust Card Premium" className="max-w-md rounded-xl shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* La Rete Della Fiducia - Bianco */}
      <section className="px-4 py-16 md:py-24 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900">
            La Rete Della Fiducia
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Ogni card TapTrust è un nodo in un ecosistema globale di reputazione reale. Un network di brand visionari e persone straordinarie uniti da autenticità, valore condiviso e visione comune.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Non sei solo. Sei parte di una comunità che ridefinisce gli standard, che eleva il concetto stesso di fiducia nel business moderno.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-[#faf8f5] p-4 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🤝</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">Connessioni Autentiche</span>
              </div>
              <div className="flex items-center gap-4 bg-[#faf8f5] p-4 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🔍</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">Crescita Condivisa</span>
              </div>
              <div className="flex items-center gap-4 bg-[#faf8f5] p-4 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏆</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">Eccellenza Collettiva</span>
              </div>
              <div className="flex items-center gap-4 bg-[#faf8f5] p-4 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📈</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">Network Premium</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/register">
              <Button className="bg-[#C9A054] hover:bg-[#B8904A] text-black font-bold text-base px-8 py-5 rounded-lg transition-all" data-testid="button-network">
                Entra nella Rete TapTrust
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing - Bianco/Beige */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-br from-[#faf8f5] to-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Scegli il Tuo Livello di Fiducia
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-[#e5e5e5] bg-[#faf8f5] rounded-2xl p-8">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center mb-4">
                  <span className="text-xl">💳</span>
                </div>
                <h3 className="text-3xl font-bold mb-2 text-gray-900">TapTrust Business</h3>
                <div className="text-4xl font-black mb-6 text-[#C9A054]">€9,99<span className="text-base text-gray-600 font-normal">/mese</span></div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  L'ingresso ufficiale nella rete della fiducia. Tutto ciò che serve per raccogliere recensioni autentiche e costruire reputazione tangibile, misurabile, inarrestabile.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#C9A054] font-bold mt-1">•</span>
                    <span>Card personalizzata con il tuo brand</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#C9A054] font-bold mt-1">•</span>
                    <span>Dashboard analytics in tempo reale</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#C9A054] font-bold mt-1">•</span>
                    <span>Trust Index™ e notifiche automatiche</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#C9A054] font-bold mt-1">•</span>
                    <span>Supporto dedicato via email e chat</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-[#C9A054] hover:bg-[#B8904A] text-black font-bold py-5 text-base" data-testid="button-business">
                    Attiva Piano Business
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#C9A054] bg-[#faf8f5] rounded-2xl p-8">
              <CardContent className="p-0">
                <div className="w-12 h-12 rounded-full bg-[#C9A054] flex items-center justify-center mb-4">
                  <span className="text-xl">👑</span>
                </div>
                <h3 className="text-3xl font-bold mb-2 text-gray-900">TapTrust Elite</h3>
                <div className="text-4xl font-black mb-6 text-[#C9A054]">Solo su Invito</div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Il livello più alto della fiducia. Design personalizzato da maestri artigiani, materiali preziosi selezionati, consulente strategico dedicato, accesso a eventi riservati globali.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#C9A054] font-bold mt-1">•</span>
                    <span>Card in materiali esclusivi premium</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#C9A054] font-bold mt-1">•</span>
                    <span>Design completamente personalizzato</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#C9A054] font-bold mt-1">•</span>
                    <span>Consulente strategico personale h24</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#C9A054] font-bold mt-1">•</span>
                    <span>Accesso eventi network élite</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <span className="text-[#C9A054] font-bold mt-1">•</span>
                    <span>Analytics avanzate predittive</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 mb-6 italic">
                  Non tutti possono accedervi. Solo chi merita di essere ricordato.
                </p>
                <Link href="/register">
                  <Button variant="outline" className="w-full border-2 border-[#C9A054] text-[#C9A054] hover:bg-[#C9A054] hover:text-black font-bold py-5 text-base" data-testid="button-elite">
                    Richiedi Invito Privato
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA - Bianco */}
      <section className="px-4 py-16 md:py-24 bg-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            La Tua Reputazione Non Aspetta
          </h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-4 leading-relaxed">
            TapTrust è il nuovo linguaggio universale della fiducia. Ogni voce raccolta, un segno indelebile. Ogni segno lasciato, un valore costruito. Ogni valore creato, un impero che resiste al tempo.
          </p>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            Il futuro della reputazione è qui. Tangibile. Misurabile. Inarrestabile. Unisciti ai visionari che hanno già scelto l'eccellenza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-[#C9A054] hover:bg-[#B8904A] text-black font-bold text-base px-10 py-6 rounded-lg transition-all w-full sm:w-auto" data-testid="button-demo">
                Richiedi Demo Gratuita
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="border-2 border-[#C9A054] text-[#C9A054] hover:bg-[#C9A054] hover:text-black font-semibold text-base px-10 py-6 rounded-lg transition-all w-full sm:w-auto" data-testid="button-business-footer">
                Scopri TapTrust Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-[#C9A054] mb-2">TAPTRUST</h3>
              <p className="text-gray-600 italic">La Fiducia. Evoluta.</p>
            </div>
            <div className="flex gap-6 text-gray-600 text-sm">
              <a href="#" className="hover:text-[#C9A054] transition-colors">Chi Siamo</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-[#C9A054] transition-colors">Privacy</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-[#C9A054] transition-colors">Contatti</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-[#C9A054] transition-colors">Termini</a>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm">
            © 2025 TapTrust — <strong>Reputazione Tangibile.</strong> Tutti i diritti riservati.
          </div>
        </div>
      </footer>
    </div>
  );
}
