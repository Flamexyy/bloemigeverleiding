import { NextResponse } from 'next/server';
import { updateCustomerPassword } from '@/app/utils/shopify';

export async function POST(request: Request) {
  try {
    const { password, accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    await updateCustomerPassword(accessToken, password);

    return NextResponse.json({ 
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to update password' },
      { status: 400 }
    );
  }
} 