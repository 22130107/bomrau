import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getSession } from "@/lib/session";

const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (cloudinaryUrl) {
  const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  if (match) {
    cloudinary.config({
      api_key: match[1],
      api_secret: match[2],
      cloud_name: match[3],
      secure: true,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "bomrau";

    const paramsToSign = { timestamp, folder };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      cloudinary.config().api_secret as string
    );

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      api_key: cloudinary.config().api_key,
      cloud_name: cloudinary.config().cloud_name,
    });
  } catch (error: any) {
    console.error("Cloudinary sign error:", error);
    return NextResponse.json(
      { error: "Lỗi tạo signature: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
