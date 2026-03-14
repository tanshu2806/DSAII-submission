import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthClient, appendToSheet } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const { eventType, gameType, teamSize, collegeName, members } = await request.json();

    if (!eventType || !collegeName || !members || !members.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const auth = await getGoogleAuthClient();
    const spreadsheetId = process.env.NEXT_PUBLIC_SPREADSHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Spreadsheet ID not configured' },
        { status: 500 }
      );
    }

    const timestamp = new Date().toISOString();

    // Map event type to the exact tab name in Google Sheets
    let sheetName = '';
    if (eventType === 'LoreQuest') sheetName = 'LoreQuest';
    else if (eventType === 'Innovex') sheetName = 'Innovex';
    else if (eventType === 'Contentflux') sheetName = 'Contentflux';
    else if (eventType === 'Geovoyager') sheetName = 'Geovoyager';
    else if (eventType === 'Battle grid') sheetName = 'BattleGrind';

    if (!sheetName) {
      return NextResponse.json(
        { error: 'Invalid or unsupported Event Type' },
        { status: 400 }
      );
    }

    // Flatten array: [Event Type, Game (if any), College Name, Team Size, Captain Name, Captain Email, Captain Contact, Member 2 Name...]
    const displayEventType = gameType ? `${eventType} - ${gameType}` : eventType;
    const values = [
      timestamp,
      displayEventType,
      collegeName,
      teamSize,
    ];

    // Add up to 5 members for Battle grid, 4 for others
    const maxMembers = eventType === 'Battle grid' ? 5 : 4;
    for (let i = 0; i < maxMembers; i++) {
      if (i < members.length) {
        values.push(members[i].name, members[i].email, members[i].contact);
      } else {
        // Padding for empty members to keep columns aligned
        values.push('', '', '');
      }
    }

    const range = `${sheetName}!A:Z`;
    await appendToSheet(auth, spreadsheetId, values, range);

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
    });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
