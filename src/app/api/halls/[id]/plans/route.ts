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

        // Fetch plans using Prisma client
        const plansWithFeatures = await prisma.hallPlan.findMany({
            where: { hallId },
            orderBy: { id: 'asc' },
            include: {
                features: {
                    orderBy: { id: 'asc' }
                }
            }
        });

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
