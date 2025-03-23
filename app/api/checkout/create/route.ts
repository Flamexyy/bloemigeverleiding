import { NextResponse } from 'next/server';
import { createCheckout } from '@/app/utils/shopify';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { message: 'Invalid items data' },
        { status: 400 }
      );
    }

    const lineItems = items.map((item: any) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    const checkoutUrl = await createCheckout(lineItems);
    
    if (!checkoutUrl) {
      throw new Error('Failed to generate checkout URL');
    }

    return NextResponse.json({ 
      success: true, 
      checkoutUrl 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create checkout'
      },
      { status: 400 }
    );
  }
} 