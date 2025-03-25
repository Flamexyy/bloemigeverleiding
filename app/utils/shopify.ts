const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

async function shopifyFetch({
  query,
  variables,
}: {
  query: string;
  variables: any;
}) {
  try {
    const url = `https://${domain}/api/2024-01/graphql.json`;
    console.log("Fetching from:", url);
    console.log("Variables:", JSON.stringify(variables, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    // Log response status and headers
    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Response not OK:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check content type
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      console.error("Unexpected content type:", contentType);
      console.error("Response text:", text);
      throw new Error("Expected JSON response but got: " + contentType);
    }

    const json = await response.json();
    console.log("Response JSON:", JSON.stringify(json, null, 2));

    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
      throw new Error(json.errors[0].message);
    }

    return json.data;
  } catch (error) {
    console.error("Error in shopifyFetch:", error);
    throw error;
  }
}

export async function createCustomer(customerData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptsMarketing?: boolean;
}) {
  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email: customerData.email,
      password: customerData.password,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      acceptsMarketing: customerData.acceptsMarketing || false,
    },
  };

  try {
    const response = await shopifyFetch({
      query: mutation,
      variables: variables,
    });

    if (response.customerCreate.customerUserErrors.length > 0) {
      throw new Error(response.customerCreate.customerUserErrors[0].message);
    }

    return response.customerCreate.customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export async function customerLogin(email: string, password: string) {
  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
    },
  };

  try {
    const response = await shopifyFetch({
      query: mutation,
      variables: variables,
    });

    if (response.customerAccessTokenCreate.customerUserErrors.length > 0) {
      throw new Error(
        response.customerAccessTokenCreate.customerUserErrors[0].message
      );
    }

    return response.customerAccessTokenCreate.customerAccessToken;
  } catch (error) {
    console.error("Error logging in customer:", error);
    throw error;
  }
}

export async function getCustomer(accessToken: string) {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
      }
    }
  `;

  const variables = {
    customerAccessToken: accessToken,
  };

  try {
    const response = await shopifyFetch({
      query,
      variables,
    });

    return response.customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
}

export async function getProducts() {
  try {
    const response = await shopifyFetch({
      query: `
        query {
          products(first: 250) {
            edges {
              node {
                id
                handle
                title
                priceRange {
                  minVariantPrice {
                    amount
                  }
                }
                compareAtPriceRange {
                  maxVariantPrice {
                    amount
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      originalSrc
                      altText
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      compareAtPrice {
                        amount
                      }
                      price {
                        amount
                      }
                      availableForSale
                      quantityAvailable
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {},
    });

    return response.products.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      price: edge.node.variants.edges[0].node.price.amount,
      compareAtPrice: edge.node.variants.edges[0].node.compareAtPrice?.amount,
      imageUrl: edge.node.images.edges[0]?.node.originalSrc || '',
      availableForSale: edge.node.variants.edges[0].node.availableForSale,
      variantId: edge.node.variants.edges[0].node.id,
      quantityAvailable: edge.node.variants.edges[0].node.quantityAvailable || 1
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProduct(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        images(first: 10) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
              }
              compareAtPrice {
                amount
              }
              availableForSale
              quantityAvailable
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
          }
          maxVariantPrice {
            amount
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
          }
          maxVariantPrice {
            amount
          }
        }
      }
    }
  `;

  const variables = {
    handle: handle,
  };

  try {
    const response = await shopifyFetch({
      query,
      variables,
    });

    if (!response?.product) {
      throw new Error('Product not found');
    }

    return response.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function createCheckout(
  lineItems: { variantId: string; quantity: number }[]
) {
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query: mutation,
      variables: {
        input: {
          lineItems,
        },
      },
    });

    if (response.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(response.checkoutCreate.checkoutUserErrors[0].message);
    }

    return response.checkoutCreate.checkout.webUrl;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

export async function getCustomerOrders(accessToken: string): Promise<
  {
    node: {
      id: string;
      orderNumber: number;
      processedAt: string;
      canceledAt: string;
      fulfillmentStatus: string;
      financialStatus: string;
      totalPriceV2: {
        amount: string;
        currencyCode: string;
      };
      lineItems: {
        edges: {
          node: {
            title: string;
            quantity: number;
            originalTotalPrice: {
              amount: string;
              currencyCode: string;
            };
            variant: {
              id: string;
              title: string;
              price: {
                amount: string;
                currencyCode: string;
              };
              image: {
                url: string;
                altText: string;
              };
            };
          };
        }[];
      };
    };
  }[]
> {
  const query = `
    query {
      customer(customerAccessToken: "${accessToken}") {
        orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              canceledAt
              fulfillmentStatus
              financialStatus
              totalPriceV2 {
                amount
                currencyCode
              }
              lineItems(first: 20) {
                edges {
                  node {
                    title
                    quantity
                    originalTotalPrice {
                      amount
                      currencyCode
                    }
                    variant {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      variables: {},
    });

    if (!response?.customer) {
      throw new Error("Customer not found");
    }

    return response.customer.orders.edges;
  } catch (error) {
    console.error("Error in getCustomerOrders:", error);
    throw error;
  }
}

export async function updateCustomer(
  accessToken: string,
  customerInput: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }
) {
  const mutation = `
    mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    // Format phone number to include country code if not present
    let formattedPhone = customerInput.phone;
    if (formattedPhone) {
      // Remove any non-digit characters
      formattedPhone = formattedPhone.replace(/\D/g, "");

      // Add +31 (Netherlands) country code if not present
      if (
        !formattedPhone.startsWith("31") &&
        !formattedPhone.startsWith("+31")
      ) {
        // Remove leading 0 if present
        if (formattedPhone.startsWith("0")) {
          formattedPhone = formattedPhone.substring(1);
        }
        formattedPhone = `+31${formattedPhone}`;
      } else if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+${formattedPhone}`;
      }
    }

    const response = await shopifyFetch({
      query: mutation,
      variables: {
        customerAccessToken: accessToken,
        customer: {
          firstName: customerInput.firstName,
          lastName: customerInput.lastName,
          email: customerInput.email,
          phone: formattedPhone || null,
        },
      },
    });

    if (response.customerUpdate.customerUserErrors.length > 0) {
      throw new Error(response.customerUpdate.customerUserErrors[0].message);
    }

    return response.customerUpdate.customer;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
}

export async function updateCustomerPassword(
  accessToken: string,
  password: string
) {
  const mutation = `
    mutation customerReset($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer {
          id
          firstName
          lastName
          email
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query: mutation,
      variables: {
        customerAccessToken: accessToken,
        customer: {
          password: password,
        },
      },
    });

    if (response.customerUpdate.customerUserErrors?.length > 0) {
      throw new Error(response.customerUpdate.customerUserErrors[0].message);
    }

    return {
      customer: response.customerUpdate.customer,
    };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

export async function customerRecover(email: string) {
  const mutation = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query: mutation,
    variables: {
      email,
    },
  });

  return response;
}
