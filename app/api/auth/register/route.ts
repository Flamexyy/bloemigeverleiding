import { NextResponse } from 'next/server';
import { createCustomer } from '@/app/utils/shopify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await createCustomer(body);
    
    const userData = {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: '',
      storeCredit: 200.00 // Add default store credit for new users
    };

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
} 