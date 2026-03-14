import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const email = formData.get('email') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email not provided' }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ImgBB API key not configured' }, { status: 500 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Build form data for ImgBB
    const imgbbForm = new FormData();
    imgbbForm.append('key', apiKey);
    imgbbForm.append('image', base64);
    imgbbForm.append('name', `payment-${email}-${Date.now()}`);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbForm,
    });

    const result = await response.json();

    if (!result.success) {
      console.error('ImgBB upload error:', result);
      return NextResponse.json({ error: 'Failed to upload screenshot' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Screenshot uploaded successfully',
      fileLink: result.data.url,
      deleteLink: result.data.delete_url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload screenshot' }, { status: 500 });
  }
}
