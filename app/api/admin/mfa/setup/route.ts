import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";

/**
 * GET /api/admin/mfa/setup
 * Generates a fresh TOTP secret and returns the QR code for scanning.
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const email = session.user?.email;
        if (!email) {
            return NextResponse.json({ error: "No email in session." }, { status: 400 });
        }

        const secret = generateSecret();
        const appName = "CampElimAfrica Admin";

        const otpAuthUrl = generateURI({
            secret,
            label: email,
            issuer: appName,
        });

        const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

        return NextResponse.json({
            secret,
            qrCode: qrCodeDataUrl,
        });
    } catch (error) {
        console.error("[mfa/setup GET]", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
