import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // For mock system, always return a mock token
        const mockToken = 'mock_token_123456789';

        return NextResponse.json({
            success: true,
            token: mockToken
        });

    } catch (error) {
        console.error("Error in get-token route:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to get token"
        }, { status: 500 })
    }
}