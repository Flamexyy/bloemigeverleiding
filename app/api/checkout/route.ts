import { NextResponse } from 'next/server';

interface CartItem {
  variantId: string;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const { items } = await request.json() as { items: CartItem[] };
    console.log('Received items:', items);

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'No items in cart' },
        { status: 400 }
      );
    }

    // Format variant IDs correctly for Shopify
    const lines = items.map(item => {
      // Ensure the variant ID is in the correct format
      let variantId = item.variantId;
      if (!variantId.startsWith('gid://')) {
        variantId = `gid://shopify/ProductVariant/${variantId}`;
      }
      
      return {
        merchandiseId: variantId,
        quantity: item.quantity
      };
    });

    // Create a cart with items directly (one API call)
    const createCartQuery = {
      query: `
        mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              message
              field
              code
            }
          }
        }
      `,
      variables: {
        input: { lines }
      }
    };

    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const shopifyUrl = `https://${shopifyDomain}/api/2024-01/graphql.json`;
    
    console.log('Sending request to Shopify:', shopifyUrl);
    
    // Create cart with items in one step
    const createCartResponse = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
      },
      body: JSON.stringify(createCartQuery)
    });

    const createCartData = await createCartResponse.json();
    console.log('Create Cart Response:', createCartData);

    if (createCartData.errors) {
      throw new Error(`GraphQL Errors: ${JSON.stringify(createCartData.errors)}`);
    }

    if (createCartData.data?.cartCreate?.userErrors?.length > 0) {
      throw new Error(`Cart Errors: ${JSON.stringify(createCartData.data.cartCreate.userErrors)}`);
    }

    const originalCheckoutUrl = createCartData.data?.cartCreate?.cart?.checkoutUrl;
    if (!originalCheckoutUrl) {
      throw new Error('No checkout URL in response');
    }

    console.log('Original Checkout URL from Shopify:', originalCheckoutUrl);

    // Extract just the path part from the checkout URL
    let checkoutPath = '';
    try {
      // Try to parse the URL to extract just the path
      const url = new URL(originalCheckoutUrl);
      checkoutPath = url.pathname + url.search;
    } catch (e) {
      // If parsing fails, try to extract the path using regex
      const match = originalCheckoutUrl.match(/\/cart\/c\/([^?]+)(?:\?key=(.+))?/);
      if (match) {
        const token = match[1];
        const key = match[2] || '';
        checkoutPath = `/cart/c/${token}${key ? `?key=${key}` : ''}`;
      } else {
        // If all else fails, just use the original URL
        checkoutPath = originalCheckoutUrl;
      }
    }

    // Construct a clean URL using the Shopify domain and the extracted path
    const finalCheckoutUrl = `https://${shopifyDomain}${checkoutPath.startsWith('/') ? '' : '/'}${checkoutPath}`;
    console.log('Final Checkout URL:', finalCheckoutUrl);

    return NextResponse.json({ checkoutUrl: finalCheckoutUrl });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Error creating checkout',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 