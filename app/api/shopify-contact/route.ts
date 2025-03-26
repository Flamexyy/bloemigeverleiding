import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    // Create a draft order or customer note in Shopify
    const shopifyResponse = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2023-07/draft_orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        draft_order: {
          note: `Contact Form Submission:
Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}`,
          email: email,
          use_customer_default_address: false
        }
      }),
    });
    
    if (!shopifyResponse.ok) {
      throw new Error('Failed to create contact in Shopify');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting to Shopify:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
} 