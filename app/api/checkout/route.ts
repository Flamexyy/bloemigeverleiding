import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    console.log('Received items:', items);

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'No items in cart' },
        { status: 400 }
      );
    }

    // Create a cart using the new Cart API
    const createCartQuery = {
      query: `
        mutation cartCreate {
          cartCreate {
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
      `
    };

    const shopifyUrl = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
    
    // First create an empty cart
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

    const cartId = createCartData.data?.cartCreate?.cart?.id;
    if (!cartId) {
      throw new Error('Failed to create cart');
    }

    // Clean up variant IDs and prepare cart lines
    const lines = items.map(item => {
      // Remove any existing 'gid://' prefix if present
      const cleanVariantId = item.variantId.replace('gid://shopify/ProductVariant/', '');
      
      return {
        merchandiseId: `gid://shopify/ProductVariant/${cleanVariantId}`,
        quantity: item.quantity
      };
    });

    // Add items to the cart
    const addItemsQuery = {
      query: `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
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
        cartId,
        lines
      }
    };

    const addItemsResponse = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!
      },
      body: JSON.stringify(addItemsQuery)
    });

    const addItemsData = await addItemsResponse.json();
    console.log('Add Items Response:', addItemsData);

    if (addItemsData.errors) {
      throw new Error(`GraphQL Errors: ${JSON.stringify(addItemsData.errors)}`);
    }

    if (addItemsData.data?.cartLinesAdd?.userErrors?.length > 0) {
      throw new Error(`Cart Errors: ${JSON.stringify(addItemsData.data.cartLinesAdd.userErrors)}`);
    }

    const checkoutUrl = addItemsData.data?.cartLinesAdd?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      throw new Error('No checkout URL in response');
    }

    return NextResponse.json({ checkoutUrl });

  } catch (error) {
    console.error('Detailed checkout error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Error creating checkout',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 