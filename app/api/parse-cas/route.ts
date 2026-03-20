import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDFUrl } from '@/services/pdf/parser';
import { parseCasTextWithAI } from '@/services/ai/parser';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileUrl, userId } = body;

    if (!fileUrl || !userId) {
      return NextResponse.json({ error: 'Missing required fields: fileUrl and userId' }, { status: 400 });
    }

    // Step 1: Fetch and Extract text from PDF
    const rawText = await extractTextFromPDFUrl(fileUrl);
    
    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from the provided PDF. It might be scanned or empty.' }, { status: 400 });
    }

    // Step 2: Use AI to structure the data
    const parsedData = await parseCasTextWithAI(rawText);

    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      return NextResponse.json({ error: 'No mutual fund data could be structured from this document.', data: [] }, { status: 400 });
    }

    // Step 3: Save to Database
    const { prisma } = await import('@/lib/prisma/client');
    const savedRecords = await prisma.$transaction(
      parsedData.map(item => 
        prisma.portfolio.create({
          data: {
            user_id: userId,
            fund_name: item.fund_name,
            folio: item.folio,
            units: item.units,
            invested_amount: item.invested_amount,
            current_value: item.current_value,
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Successfully parsed and saved ${savedRecords.length} portfolio records.`,
      data: savedRecords
    }, { status: 200 });

  } catch (error: any) {
    console.error('Parse-CAS API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'An internal server error occurred during CAS parsing.' 
    }, { status: 500 });
  }
}
