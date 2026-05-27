"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { revalidatePath } from "next/cache";

export async function submitReview(data: {
    itemType: string;
    referenceId: number;
    rating: number;
    comment: string;
    authorName: string;
    authorEmail: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        let clientId = null;

        if (session?.user?.email) {
            const client = await prisma.client.findUnique({
                where: { email: session.user.email }
            });
            if (client) {
                clientId = client.id;
            }
        }

        const review = await prisma.review.create({
            data: {
                itemType: data.itemType,
                referenceId: data.referenceId,
                rating: data.rating,
                comment: data.comment,
                authorName: data.authorName,
                authorEmail: data.authorEmail,
                clientId: clientId
            }
        });

        // Revalidate the product page to show new review immediately
        revalidatePath(`/products/${data.referenceId}`);
        revalidatePath(`/billboard-booking`); // just in case

        const serializedReview = {
            ...review,
            createdAt: review.createdAt.toISOString(),
            updatedAt: review.updatedAt.toISOString()
        };

        return { success: true, data: serializedReview, message: "Review submitted successfully!" };
    } catch (error) {
        console.error("Submit review error:", error);
        return { success: false, message: "Failed to submit review." };
    }
}

export async function getReviews(itemType: string, referenceId: number) {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                itemType,
                referenceId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalReviews = reviews.length;
        let averageRating = 0;
        const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        if (totalReviews > 0) {
            const sum = reviews.reduce((acc, review) => {
                // Count distribution
                if (ratingCounts[review.rating as keyof typeof ratingCounts] !== undefined) {
                    ratingCounts[review.rating as keyof typeof ratingCounts]++;
                }
                return acc + review.rating;
            }, 0);
            averageRating = sum / totalReviews;
        }

        const serializedReviews = reviews.map(r => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString()
        }));

        return { 
            success: true, 
            data: {
                reviews: serializedReviews,
                totalReviews,
                averageRating,
                ratingCounts
            }
        };
    } catch (error) {
        console.error("Get reviews error:", error);
        return { success: false, message: "Failed to fetch reviews." };
    }
}
