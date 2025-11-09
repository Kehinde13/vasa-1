// app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side
);

export async function POST(req: NextRequest) {
  console.log("=== UPLOAD API CALLED ===");
  
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session?.user?.id ? "Found" : "Not found");
    
    if (!session?.user?.id) {
      console.log("Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    console.log("FormData received");
    
    const file = formData.get("file") as File;
    const clientId = formData.get("clientId") as string;

    console.log("File:", file?.name, file?.type, file?.size);
    console.log("Client ID:", clientId);

    if (!file || !clientId) {
      console.log("Missing file or clientId");
      return NextResponse.json(
        { error: "File and clientId are required" },
        { status: 400 }
      );
    }

    // Verify the client belongs to the user
    console.log("Checking client ownership...");
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: session.user.id,
      },
    });

    if (!client) {
      console.log("Client not found or doesn't belong to user");
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    console.log("Client verified:", client.name);

    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${clientId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    console.log("Generated filename:", fileName);

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("File converted to buffer, size:", buffer.length);

    // Upload to Supabase Storage
    console.log("Uploading to Supabase...");
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file", details: uploadError.message },
        { status: 500 }
      );
    }

    console.log("Upload successful:", uploadData);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    console.log("Public URL:", urlData.publicUrl);

    // Save document reference to database
    console.log("Saving to database...");
    const document = await prisma.document.create({
      data: {
        name: file.name,
        url: urlData.publicUrl,
        clientId,
      },
    });

    console.log("Document saved:", document.id);
    console.log("=== UPLOAD COMPLETE ===");

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Failed to upload document", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Increase the max file size limit (default is 4.5MB)
export const config = {
  api: {
    bodyParser: false,
  },
};