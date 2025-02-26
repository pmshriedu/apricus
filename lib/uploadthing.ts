// lib/uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  hotelImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async ({}) => {
      // Verify user is authenticated
      return { userId: "admin" };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),

  roomImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async ({}) => {
      // Verify user is authenticated
      return { userId: "admin" };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
