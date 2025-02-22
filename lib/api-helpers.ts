// lib/api-helpers.ts
import { NextResponse } from "next/server";
import { ApiError } from "./utils";
import { ApiResponse } from "@/types";

export function handleSuccess<T>(data: T) {
  return NextResponse.json<ApiResponse<T>>({
    success: true,
    data,
  });
}

export function handleError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: error.message },
      { status: error.statusCode }
    );
  }

  return NextResponse.json<ApiResponse<never>>(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}
