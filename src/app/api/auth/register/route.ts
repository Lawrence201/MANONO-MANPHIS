import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, phone, password } = body;

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.client.findUnique({
            where: { email: email.toLowerCase().trim() }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const name = `${firstName} ${lastName}`.trim();

        const newUser = await prisma.client.create({
            data: {
                name,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                phoneNumber: phone,
            }
        });

        // Don't send back password
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            { message: "User registered successfully", user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
