import PolicyLayout from '../components/PolicyLayout';

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="PRIVACY POLICY">
      <section className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when using our services.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal information (name, email, address)</li>
            <li>Payment information</li>
            <li>Shopping preferences and history</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process your orders</li>
            <li>Send order updates</li>
            <li>Improve our services</li>
            <li>Communicate about promotions</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">3. Information Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
        </div>

        {/* Add more sections as needed */}
      </section>
    </PolicyLayout>
  );
} 