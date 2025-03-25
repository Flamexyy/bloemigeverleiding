import { NextResponse } from "next/server";
import { getCustomerOrders } from "@/app/utils/shopify";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "");
    
    if (!accessToken) {
      return NextResponse.json(
        { message: "Please log in to view your orders" },
        { status: 401 }
      );
    }
    
    try {
      const ordersData = await getCustomerOrders(accessToken);

      const formattedOrders = ordersData
        .map((order) => {
          try {
            // Calculate line items with fixed prices from the original order data
            const lineItems = order.node.lineItems.edges.map((item) => {
              // Get the original price at time of order
              const unitPrice = 
                // Try to get the original price from the line item
                (item.node.originalTotalPrice?.amount && item.node.quantity > 0)
                  ? (parseFloat(item.node.originalTotalPrice.amount) / item.node.quantity).toFixed(2)
                  // Fall back to variant price if original price isn't available
                  : item.node.variant?.price?.amount || "0.00";
              
              // Calculate the line total using the original price
              const lineTotal = (parseFloat(unitPrice) * item.node.quantity).toFixed(2);
              
              return {
                title: item.node.title,
                quantity: item.node.quantity,
                variant: {
                  price: unitPrice,
                },
                lineTotal: lineTotal,
                imageUrl: item.node.variant?.image?.url || "",
              };
            });
            
            // Calculate the total price of all line items
            const itemsTotal = lineItems.reduce((sum, item) => {
              return sum + parseFloat(item.lineTotal);
            }, 0);

            // Calculate shipping as the difference between order total and items total
            const calculatedShippingPrice = (
              parseFloat(order.node.totalPriceV2.amount) - itemsTotal
            ).toFixed(2);

            // Use the calculated shipping price if it's positive, otherwise use 0
            const displayShippingPrice = parseFloat(calculatedShippingPrice) > 0 
              ? calculatedShippingPrice 
              : "0.00";
            
            return {
              id: order.node.id,
              orderNumber: order.node.orderNumber,
              totalPrice: order.node.totalPriceV2.amount,
              currencyCode: order.node.totalPriceV2.currencyCode,
              createdAt: order.node.processedAt,
              shippingPrice: displayShippingPrice,
              status: order.node.canceledAt
                ? "CANCELLED"
                : order.node.financialStatus === "REFUNDED"
                ? "REFUNDED"
                : order.node.fulfillmentStatus === "FULFILLED"
                ? "COMPLETED"
                : order.node.fulfillmentStatus || "UNFULFILLED",
              lineItems: lineItems,
            };
          } catch (error) {
            console.error("Error formatting order:", error, order);
            return null;
          }
        })
        .filter(Boolean);

      return NextResponse.json({ orders: formattedOrders });
    } catch (error) {
      console.error("Shopify API Error:", error);
      return NextResponse.json(
        { message: "Error fetching orders from Shopify API" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
