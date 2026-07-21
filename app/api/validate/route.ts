import { NextRequest, NextResponse } from "next/server";
import { validateDeliveryAccount } from "@/validators/_validate-accounts.dispatcher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, field1, field2 } = body;

    if (!company || typeof company !== "string") {
      return NextResponse.json(
        { valid: false, message: "Company is required." },
        { status: 400 }
      );
    }

    const isValid = await validateDeliveryAccount(
      company,
      field1 || "",
      field2 || ""
    );

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error("API Validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Internal server error during validation." },
      { status: 500 }
    );
  }
}
