import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySync } from "otplib";

/**
 * POST /api/admin/mfa/verify
 * Verifies a TOTP code during login (step 2 of the 2-step admin login).
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, token } = body;

        if (!email || !token) {
            return NextResponse.json(
                { error: "Email and token are required." },
                { status: 400 }
            );
        }

        const admin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        if (!admin || !admin.totpEnabled || !admin.totpSecret) {
            return NextResponse.json(
                { error: "MFA not configured for this account." },
                { status: 400 }
            );
        }

        const cleanToken = token.replace(/\s/g, "");
        const result = verifySync({ token: cleanToken, secret: admin.totpSecret });

        if (!result?.valid) {
            return NextResponse.json(
                { error: "Invalid or expired code. Please try again." },
                { status: 401 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[mfa/verify]", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
