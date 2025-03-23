import PolicyLayout from '../components/PolicyLayout';

export default function TermsOfService() {
  return (
    <PolicyLayout title="TERMS OF SERVICE">
      <section className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
          <p>By accessing and using our services, you agree to be bound by these Terms of Service.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 18 years old to use our services</li>
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the security of your account</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">2. Orders and Payments</h2>
          <p>When placing an order through our platform:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You agree to provide current, complete, and accurate purchase information</li>
            <li>We reserve the right to refuse any order for any reason</li>
            <li>Prices are subject to change without notice</li>
            <li>Payment must be received prior to order fulfillment</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">3. Shipping and Delivery</h2>
          <p>Our shipping and delivery terms:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Delivery times are estimates and not guaranteed</li>
            <li>Risk of loss and title pass to you upon delivery</li>
            <li>You are responsible for providing accurate shipping information</li>
            <li>International orders may be subject to customs duties and taxes</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">4. Returns and Refunds</h2>
          <p>Our return policy includes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>30-day return window from the date of delivery</li>
            <li>Items must be unused and in original packaging</li>
            <li>Return shipping costs are the responsibility of the customer</li>
            <li>Refunds will be processed within 14 business days</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
          <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">6. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our website.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">7. Contact Information</h2>
          <p>Questions about the Terms of Service should be sent to us at support@example.com.</p>
        </div>
      </section>
    </PolicyLayout>
  );
} 