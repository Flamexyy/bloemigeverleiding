import { NextResponse } from 'next/server';
import { customerLogin, getCustomer } from '@/app/utils/shopify';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Get access token
    const { accessToken } = await customerLogin(email, password);
    
    // Get customer data
    const customer = await getCustomer(accessToken);

    // Store user data in the response
    const userData = {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone || '',
      accessToken // Include the access token in the user data
    };

    // Store the access token in cookies
    cookies().set('shopifyCustomerAccessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return NextResponse.json({ 
      success: true, 
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    );
  }
} 