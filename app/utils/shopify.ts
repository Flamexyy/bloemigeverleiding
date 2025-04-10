const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

async function shopifyFetch({ query, variables }: { query: string; variables: any }) {
  try {
    const url = `https://${domain}/api/2024-01/graphql.json`;

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
      throw new Error(response.customerAccessTokenCreate.customerUserErrors[0].message);
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

export async function getCollections() {
  const query = `
    query getCollections {
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;

  const response = await shopifyFetch({
    query,
    variables: {},
  });

  return response.collections.edges.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
  }));
}

export async function getProducts({ collection = undefined as string | undefined, first = 20, query = "", reverse = false, sortKey = "TITLE" } = {}) {
  // If we have a collection, let's try to query by handle first
  if (collection) {
    // Try to determine if this is a handle or ID
    const isGid = collection.includes("gid://");
    const isNumeric = /^\d+$/.test(collection);

    // If it's not a GID and not numeric, assume it's a handle
    if (!isGid && !isNumeric) {
      // Query by collection handle
      const collectionQuery = `
        query getProductsByCollection($handle: String!, $first: Int!) {
          collection(handle: $handle) {
            products(first: $first) {
              edges {
                node {
                  id
                  title
                  handle
                  description
                  createdAt
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  compareAtPriceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        id
                        availableForSale
                        quantityAvailable
                        price {
                          amount
                          currencyCode
                        }
                        compareAtPrice {
                          amount
                          currencyCode
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
          query: collectionQuery,
          variables: {
            handle: collection,
            first,
          },
        });

        if (response.collection && response.collection.products.edges.length > 0) {
          return response.collection.products.edges.map((edge: any) => {
            const product = edge.node;
            const variant = product.variants.edges[0]?.node;
            const image = product.images.edges[0]?.node;

            const hasVariants = product.variants.edges.length > 1;

            return {
              id: product.id,
              title: product.title,
              handle: product.handle,
              description: product.description,
              createdAt: product.createdAt,
              collections: [{ id: collection, title: "Collection" }], // Placeholder
              price: variant?.price.amount || product.priceRange.minVariantPrice.amount,
              compareAtPrice: variant?.compareAtPrice?.amount || null,
              currencyCode: variant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode,
              imageUrl: image?.url || "",
              imageAlt: image?.altText || product.title,
              availableForSale: variant?.availableForSale || false,
              variantId: variant?.id || "",
              quantityAvailable: variant?.quantityAvailable || 0,
              hasVariants: hasVariants,
            };
          });
        }
      } catch (error) {
        console.error("Error fetching products by collection handle:", error);
        // Fall back to the regular query
      }
    }
  }

  // Regular query if we don't have a collection handle or the handle query failed
  const gqlQuery = `
    query getProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean, $after: String) {
      products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            createdAt
            collections(first: 5) {
              edges {
                node {
                  id
                  title
                  handle
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  // Build the query string
  let queryString = "";
  if (collection) {
    // Handle different collection ID formats
    let collectionId: string | null = collection;

    // If it's not already a gid format
    if (!collection.includes("gid://")) {
      // Check if it's just a numeric ID
      if (/^\d+$/.test(collection)) {
        collectionId = `gid://shopify/Collection/${collection}`;
      }
      // If it has a Collection/ prefix but no gid
      else if (collection.includes("Collection/")) {
        collectionId = `gid://shopify/${collection}`;
      }
      // Otherwise assume it's a handle and use collection:handle syntax
      else {
        queryString += `collection:${collection} `;
        collectionId = null; // Skip adding collection_id
      }
    }

    if (collectionId) {
      queryString += `collection_id:${collectionId} `;
    }
  }

  if (query) {
    queryString += query;
  }

  const response = await shopifyFetch({
    query: gqlQuery,
    variables: {
      first,
      query: queryString,
      sortKey,
      reverse,
    },
  });

  const processedProducts = response.products.edges.map((edge: any) => {
    const product = edge.node;
    const variant = product.variants.edges[0]?.node;
    const image = product.images.edges[0]?.node;

    // Extract collections data
    const collections = product.collections.edges.map((colEdge: any) => ({
      id: colEdge.node.id,
      title: colEdge.node.title,
      handle: colEdge.node.handle,
    }));

    // Check if the product has multiple variants
    const hasVariants = product.variants.edges.length > 1;

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      createdAt: product.createdAt,
      collections: collections,
      price: variant?.price.amount || product.priceRange.minVariantPrice.amount,
      compareAtPrice: variant?.compareAtPrice?.amount || null,
      currencyCode: variant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode,
      imageUrl: image?.url || "",
      imageAlt: image?.altText || product.title,
      availableForSale: variant?.availableForSale || false,
      variantId: variant?.id || "",
      quantityAvailable: variant?.quantityAvailable || 0,
      hasVariants: hasVariants,
      variantsCount: product.variants.edges.length,
    };
  });

  return processedProducts;
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
      throw new Error("Product not found");
    }

    return response.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function createCheckout(lineItems: { variantId: string; quantity: number }[]) {
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
  },
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
      if (!formattedPhone.startsWith("31") && !formattedPhone.startsWith("+31")) {
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

export async function updateCustomerPassword(accessToken: string, password: string) {
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
