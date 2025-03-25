import PolicyLayout from '../components/PolicyLayout';

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="PRIVACYBELEID">
      <section className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">1. Informatie die wij verzamelen</h2>
          <p className="text-text">Wij verzamelen informatie die u rechtstreeks aan ons verstrekt bij het gebruik van onze diensten.</p>
          <ul className="list-disc pl-6 space-y-2 text-text">
            <li>Persoonlijke gegevens (naam, e-mail, adres)</li>
            <li>Betalingsgegevens</li>
            <li>Winkelvoorkeuren en -geschiedenis</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">2. Hoe wij uw informatie gebruiken</h2>
          <p className="text-text">Wij gebruiken de verzamelde informatie om:</p>
          <ul className="list-disc pl-6 space-y-2 text-text">
            <li>Uw bestellingen te verwerken</li>
            <li>Bestelupdates te versturen</li>
            <li>Onze diensten te verbeteren</li>
            <li>Te communiceren over promoties</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">3. Informatiebeveiliging</h2>
          <p className="text-text">Wij implementeren passende beveiligingsmaatregelen om uw persoonlijke gegevens te beschermen.</p>
        </div>

        {/* Add more sections as needed */}
      </section>
    </PolicyLayout>
  );
} 