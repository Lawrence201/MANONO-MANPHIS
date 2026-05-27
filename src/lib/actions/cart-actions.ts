"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { revalidatePath } from "next/cache";

export async function getCart() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, message: "Please log in to view your cart", data: null };
        }

        const client = await prisma.client.findUnique({
            where: { email: session.user.email }
        });

        if (!client) {
            return { success: false, message: "User not found", data: null };
        }

        const cart = await prisma.cart.findFirst({
            where: { clientId: client.id, status: "active" },
            include: { items: true },
            orderBy: { createdAt: "desc" }
        });

        if (!cart) {
            return { success: true, data: null };
        }

        const serializedItems = cart.items.map((item) => ({
            id: item.id,
            cartId: item.cartId,
            itemType: item.itemType,
            referenceId: item.referenceId,
            name: item.name,
            price: Number(item.price), // Convert Decimal to plain number
            quantity: item.quantity,
            imagePath: item.imagePath,
            details: item.details,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString()
        }));

        const serializedCart = {
            id: cart.id,
            clientId: cart.clientId,
            sessionId: cart.sessionId,
            status: cart.status,
            createdAt: cart.createdAt.toISOString(),
            updatedAt: cart.updatedAt.toISOString(),
            items: serializedItems
        };

        return { success: true, data: serializedCart };
    } catch (error) {
        console.error("Get cart error:", error);
        return { success: false, message: "Failed to fetch cart", data: null };
    }
}

export async function addToCart(itemData: {
    itemType: string;
    referenceId: number;
    name: string;
    price: number;
    quantity: number;
    imagePath?: string;
    details?: any;
}) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, message: "Please log in to add items to your cart" };
        }

        const client = await prisma.client.findUnique({
            where: { email: session.user.email }
        });

        if (!client) {
            return { success: false, message: "User not found" };
        }

        // Find or create active cart
        let cart = await prisma.cart.findFirst({
            where: { clientId: client.id, status: "active" },
            orderBy: { createdAt: "desc" }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    clientId: client.id,
                    status: "active"
                }
            });
        }

        // Check if item already exists in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                itemType: itemData.itemType,
                referenceId: itemData.referenceId
            }
        });

        if (existingItem) {
            // Update quantity
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + itemData.quantity
                }
            });
        } else {
            // Add new item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    itemType: itemData.itemType,
                    referenceId: itemData.referenceId,
                    name: itemData.name,
                    price: itemData.price,
                    quantity: itemData.quantity,
                    imagePath: itemData.imagePath,
                    details: itemData.details || undefined
                }
            });
        }

        revalidatePath("/cart");
        return { success: true, message: "Item added to cart successfully" };
    } catch (error) {
        console.error("Add to cart error:", error);
        return { success: false, message: "Failed to add item to cart" };
    }
}

export async function removeFromCart(cartItemId: number) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, message: "Unauthorized" };
        }

        await prisma.cartItem.delete({
            where: { id: cartItemId }
        });

        revalidatePath("/cart");
        return { success: true, message: "Item removed from cart" };
    } catch (error) {
        console.error("Remove from cart error:", error);
        return { success: false, message: "Failed to remove item" };
    }
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { success: false, message: "Unauthorized" };
        }

        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        });

        revalidatePath("/cart");
        return { success: true };
    } catch (error) {
        console.error("Update cart quantity error:", error);
        return { success: false, message: "Failed to update quantity" };
    }
}
