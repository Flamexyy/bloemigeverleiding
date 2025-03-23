import PolicyLayout from '../components/PolicyLayout';

export default function TermsOfUse() {
  return (
    <PolicyLayout title="TERMS OF USE">
      <section className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
          <p>By accessing and using this website, you accept and agree to be bound by these Terms of Use.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">2. User Conduct</h2>
          <p>When using our website, you agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Interfere with the website's operation</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">3. Intellectual Property</h2>
          <p>All content on this website is protected by copyright and other intellectual property rights.</p>
        </div>

        {/* Add more sections as needed */}
      </section>
    </PolicyLayout>
  );
} 