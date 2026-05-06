import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * POST /api/admin/mfa/verify-credentials
 * Validates admin email/password WITHOUT creating a session.
 * Returns mfaEnabled flag so the login page can decide next step.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        if (!EMAIL_REGEX.test(email.trim())) {
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 }
            );
        }

        if (password.length > 72) {
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        // Use constant-time compare to prevent timing attacks
        const dummyHash = "$2a$10$dummyHashForTimingAttackPreventionXX";
        const passwordToCompare = admin?.password || dummyHash;
        const isCorrect = await bcrypt.compare(password, passwordToCompare);

        if (!admin || !isCorrect) {
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 }
            );
        }

        // Credentials are valid — tell the client whether MFA is required
        return NextResponse.json({
            success: true,
            mfaEnabled: admin.totpEnabled,
        });
    } catch (error) {
        console.error("[verify-credentials]", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
