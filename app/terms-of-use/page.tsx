import PolicyLayout from '../components/PolicyLayout';

export default function TermsOfUse() {
  return (
    <PolicyLayout title="GEBRUIKSVOORWAARDEN">
      <section className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">1. Acceptatie van Voorwaarden</h2>
          <p className="text-text">Door deze website te bezoeken en te gebruiken, accepteert u en gaat u akkoord met deze Gebruiksvoorwaarden.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">2. Gebruikersgedrag</h2>
          <p className="text-text">Bij het gebruik van onze website stemt u ermee in om niet:</p>
          <ul className="list-disc pl-6 space-y-2 text-text">
            <li>Toepasselijke wet- en regelgeving te overtreden</li>
            <li>Inbreuk te maken op de rechten van anderen</li>
            <li>De werking van de website te verstoren</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">3. Intellectueel Eigendom</h2>
          <p className="text-text">Alle inhoud op deze website is beschermd door auteursrecht en andere intellectuele eigendomsrechten.</p>
        </div>

        {/* Add more sections as needed */}
      </section>
    </PolicyLayout>
  );
} 