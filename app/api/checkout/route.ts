import { NextResponse } from 'next/server';

interface CartItem {
  variantId: string;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const { items } = await request.json() as { items: CartItem[] };
    console.log('🛒 Received items:', items);

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
      console.log("✅ Sending variant ID:", variantId);
      
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

    // IMPORTANT: Use the exact Shopify store domain, not your custom domain
    const shopifyDomain = "6s5ipy-02.myshopify.com";
    const shopifyUrl = `https://${shopifyDomain}/api/2024-01/graphql.json`;
    
    console.log('🔗 Sending request to Shopify:', shopifyUrl);
    
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
    console.log('📦 Create Cart Response:', createCartData);

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

    console.log('🔗 Original Checkout URL from Shopify:', originalCheckoutUrl);

    // Extract the token and key from the checkout URL
    // This is a more robust approach to handle different URL formats
    
    // Try to extract token and key using regex
    const cartMatch = originalCheckoutUrl.match(/\/cart\/c\/([^?\/]+)(?:\?key=(.+))?/);

    console.log(`https://${process.env.NEXT_PUBLIC_CHECKOUT_DOMAIN!}${cartMatch[0]}`)

    if (cartMatch.length >= 1) {
      return NextResponse.json({ checkoutUrl: `https://${process.env.NEXT_PUBLIC_CHECKOUT_DOMAIN!}${cartMatch[0]}` });
    } else {
      return NextResponse.json({ checkoutUrl: originalCheckoutUrl });
    }
  } catch (error) {
    console.error('❌ Checkout error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Error creating checkout',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 