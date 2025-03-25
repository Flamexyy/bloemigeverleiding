import PolicyLayout from '../components/PolicyLayout';

export default function TermsOfService() {
  return (
    <PolicyLayout title="SERVICEVOORWAARDEN">
      <section className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">1. Akkoord met Voorwaarden</h2>
          <p className="text-text">Door gebruik te maken van onze diensten gaat u akkoord met deze Servicevoorwaarden.</p>
          <ul className="list-disc pl-6 space-y-2 text-text">
            <li>U moet minimaal 18 jaar oud zijn om gebruik te maken van onze diensten</li>
            <li>U moet nauwkeurige en volledige informatie verstrekken bij het aanmaken van een account</li>
            <li>U bent verantwoordelijk voor het handhaven van de beveiliging van uw account</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">2. Bestellingen en Betalingen</h2>
          <p className="text-text">Bij het plaatsen van een bestelling via ons platform:</p>
          <ul className="list-disc pl-6 space-y-2 text-text">
            <li>Gaat u ermee akkoord actuele, volledige en nauwkeurige aankoopinformatie te verstrekken</li>
            <li>Behouden wij ons het recht voor om bestellingen om welke reden dan ook te weigeren</li>
            <li>Kunnen prijzen zonder voorafgaande kennisgeving worden gewijzigd</li>
            <li>Moet de betaling zijn ontvangen voordat de bestelling wordt uitgevoerd</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">3. Verzending en Levering</h2>
          <p className="text-text">Onze verzend- en leveringsvoorwaarden:</p>
          <ul className="list-disc pl-6 space-y-2 text-text">
            <li>Levertijden zijn schattingen en niet gegarandeerd</li>
            <li>Risico van verlies en eigendom gaat over op u bij levering</li>
            <li>U bent verantwoordelijk voor het verstrekken van juiste verzendgegevens</li>
            <li>Internationale bestellingen kunnen onderhevig zijn aan douanerechten en belastingen</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">4. Retourneren en Terugbetalingen</h2>
          <p className="text-text">Ons retourbeleid omvat:</p>
          <ul className="list-disc pl-6 space-y-2 text-text">
            <li>30 dagen retourperiode vanaf de datum van levering</li>
            <li>Artikelen moeten ongebruikt zijn en in originele verpakking</li>
            <li>Retourzendingskosten zijn voor rekening van de klant</li>
            <li>Terugbetalingen worden binnen 14 werkdagen verwerkt</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">5. Beperking van Aansprakelijkheid</h2>
          <p className="text-text">Wij zijn niet aansprakelijk voor indirecte, incidentele, bijzondere, gevolgschade of punitieve schade die voortvloeit uit uw gebruik van onze diensten.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">6. Wijzigingen in Voorwaarden</h2>
          <p className="text-text">Wij behouden ons het recht voor om deze voorwaarden op elk moment te wijzigen. We zullen gebruikers via e-mail of via onze website op de hoogte stellen van materiële wijzigingen.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">7. Contactgegevens</h2>
          <p className="text-text">Vragen over de Servicevoorwaarden kunnen worden gestuurd naar support@bloemigeverleiding.nl</p>
        </div>
      </section>
    </PolicyLayout>
  );
} 