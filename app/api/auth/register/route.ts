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
      accessToken: customer.accessToken
    };

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
} 