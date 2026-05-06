import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const hallId = parseInt(id);

        if (isNaN(hallId)) {
            return NextResponse.json(
                { error: 'Invalid hall ID' },
                { status: 400 }
            );
        }

        // Fetch hall name
        const hall = await prisma.hall.findUnique({
            where: { id: hallId },
            select: { id: true, name: true }
        });

        if (!hall) {
            return NextResponse.json(
                { error: 'Hall not found' },
                { status: 404 }
            );
        }

        // Fetch plans using raw SQL since Prisma client might not be synced
        const plans = await prisma.$queryRaw<{
            id: number;
            name: string;
            description: string | null;
            price: string;
            validity: string | null;
        }[]>`
            SELECT id, name, description, price, validity 
            FROM hall_plans 
            WHERE hall_id = ${hallId}
            ORDER BY id ASC
        `;

        // Fetch features for each plan
        const plansWithFeatures = await Promise.all(
            plans.map(async (plan) => {
                const features = await prisma.$queryRaw<{
                    id: number;
                    featureText: string;
                }[]>`
                    SELECT id, feature_text as "featureText" 
                    FROM hall_plan_features 
                    WHERE plan_id = ${plan.id}
                    ORDER BY id ASC
                `;
                return { ...plan, features };
            })
        );

        return NextResponse.json({
            hall,
            plans: plansWithFeatures
        });
    } catch (error) {
        console.error('Error fetching hall plans:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
