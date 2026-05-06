import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifySync } from "otplib";

/**
 * POST /api/admin/mfa/verify-setup
 * Verifies the first TOTP code and saves the secret to the database,
 * enabling MFA for the admin account.
 * Body: { secret, token }
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const email = session.user?.email;
        if (!email) {
            return NextResponse.json({ error: "No email in session." }, { status: 400 });
        }

        const body = await req.json();
        const { secret, token } = body;

        if (!secret || !token) {
            return NextResponse.json(
                { error: "Secret and token are required." },
                { status: 400 }
            );
        }

        const result = verifySync({ token: token.replace(/\s/g, ""), secret });

        if (!result?.valid) {
            return NextResponse.json(
                { error: "Invalid code. Please try again." },
                { status: 401 }
            );
        }

        // Save the secret and enable MFA
        await prisma.admin.update({
            where: { email },
            data: {
                totpSecret: secret,
                totpEnabled: true,
            },
        });

        return NextResponse.json({ success: true, message: "MFA enabled successfully." });
    } catch (error) {
        console.error("[mfa/verify-setup]", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/mfa/verify-setup
 * Disables MFA for the admin account.
 */
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const email = session.user?.email;
        if (!email) {
            return NextResponse.json({ error: "No email in session." }, { status: 400 });
        }

        await prisma.admin.update({
            where: { email },
            data: {
                totpSecret: null,
                totpEnabled: false,
            },
        });

        return NextResponse.json({ success: true, message: "MFA disabled." });
    } catch (error) {
        console.error("[mfa/verify-setup DELETE]", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
