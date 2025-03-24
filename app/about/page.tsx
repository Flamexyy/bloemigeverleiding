'use client';

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
      <div className="py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We're passionate about delivering quality products and exceptional experiences to our customers.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to provide high-quality products while maintaining sustainable and ethical business practices. 
              We believe in creating value for our customers through innovation and exceptional service.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                <div>
                  <h3 className="font-bold mb-1">Quality First</h3>
                  <p className="text-gray-600">We never compromise on quality, ensuring each product meets our high standards.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                <div>
                  <h3 className="font-bold mb-1">Customer Focus</h3>
                  <p className="text-gray-600">Your satisfaction is our priority, with dedicated support and service.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                <div>
                  <h3 className="font-bold mb-1">Sustainability</h3>
                  <p className="text-gray-600">We're committed to environmentally responsible practices.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gray-100 rounded-[50px] rounded-tr-[100px] rounded-bl-[100px] aspect-square"></div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-4">Free Shipping</h3>
              <p className="text-gray-600 mb-6">
                Enjoy free shipping on all orders over €50. We deliver to anywhere in Europe within 2-4 business days.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Fast and reliable delivery
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Real-time tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Secure packaging
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-4">Easy Returns</h3>
              <p className="text-gray-600 mb-6">
                Not satisfied? Return any item within 30 days for a full refund. No questions asked.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  30-day return policy
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Free return shipping
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Quick refund process
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-gray-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Have questions? We're here to help. Contact our customer support team anytime.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-white rounded-2xl">
              <h3 className="font-bold mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm">support@example.com</p>
            </div>
            <div className="p-6 bg-white rounded-2xl">
              <h3 className="font-bold mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm">+1 234 567 890</p>
            </div>
            <div className="p-6 bg-white rounded-2xl">
              <h3 className="font-bold mb-2">Follow Us</h3>
              <p className="text-gray-600 text-sm">@shopname</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 