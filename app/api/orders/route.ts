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
            return {
              id: order.node.id,
              orderNumber: order.node.orderNumber,
              totalPrice: order.node.totalPriceV2.amount,
              currencyCode: order.node.totalPriceV2.currencyCode,
              createdAt: order.node.processedAt,
              status: order.node.canceledAt
                ? "CANCELLED"
                : order.node.financialStatus === "REFUNDED"
                ? "REFUNDED"
                : order.node.fulfillmentStatus === "FULFILLED"
                ? "COMPLETED"
                : order.node.fulfillmentStatus || "UNFULFILLED",
              lineItems: order.node.lineItems.edges.map((item) => ({
                title: item.node.title,
                quantity: item.node.quantity,
                variant: {
                  price:
                    item.node.variant?.price?.amount ||
                    item.node.originalTotalPrice?.amount ||
                    "0.00",
                },
                imageUrl: item.node.variant?.image?.url || "",
              })),
            };
          } catch (error) {
            console.error("Error formatting order:", error, order);
            return null;
          }
        })
        .filter(Boolean); // Remove any null values from mapping errors

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
