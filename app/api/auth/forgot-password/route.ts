import { NextResponse } from 'next/server';
import { customerRecover } from '@/app/utils/shopify';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Use Shopify's customer recovery
    await customerRecover(email);
    
    return NextResponse.json({ 
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Failed to send reset email' },
      { status: 500 }
    );
  }
} 