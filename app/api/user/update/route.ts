import { NextResponse } from 'next/server';
import { updateCustomer } from '@/app/utils/shopify';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const updatedCustomer = await updateCustomer(accessToken, {
      firstName,
      lastName,
      email,
      phone
    });

    // Update the user data that will be stored in localStorage
    const userData = {
      id: updatedCustomer.id,
      email: updatedCustomer.email,
      firstName: updatedCustomer.firstName,
      lastName: updatedCustomer.lastName,
      phone: updatedCustomer.phone || '',
      accessToken
    };

    return NextResponse.json({ 
      success: true, 
      user: userData 
    });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 400 }
    );
  }
} 