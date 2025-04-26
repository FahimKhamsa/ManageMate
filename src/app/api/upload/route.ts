// // app/api/upload/route.ts
// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { v2 as cloudinary } from 'cloudinary'

// // Configure Cloudinary (or your preferred storage)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// export async function POST(request: Request) {
//   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const formData = await request.formData()
//   const file = formData.get('file') as File

//   if (!file) {
//     return NextResponse.json({ error: 'No file provided' }, { status: 400 })
//   }

//   try {
//     // Convert file to buffer
//     const buffer = await file.arrayBuffer()
//     const bytes = new Uint8Array(buffer)

//     // Upload to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream({ resource_type: 'auto' }, (error, result) => {
//           if (error) reject(error)
//           else resolve(result)
//         })
//         .end(bytes)
//     })

//     return NextResponse.json({
//       imageUrl: result.secure_url,
//       publicId: result.public_id,
//     })
//   } catch (error) {
//     console.error('Upload failed:', error)
//     return NextResponse.json(
//       { error: 'Failed to upload file' },
//       { status: 500 }
//     )
//   }
// }
