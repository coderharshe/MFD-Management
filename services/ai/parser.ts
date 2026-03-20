import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export interface ParsedFundData {
  fund_name: string;
  folio: string;
  units: string;
  invested_amount: string;
  current_value: string;
}

export async function parseCasTextWithAI(rawText: string): Promise<ParsedFundData[]> {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. Using mock parsing array for developmental bypass.");
    return [];
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert financial data extraction parser.
I will provide you with the raw text extracted from a Consolidated Account Statement (CAS) PDF.
Your job is to identify all Mutual Fund holdings and extract their details into a strict JSON array.

Requirements for extraction:
1. "fund_name": Name of the mutual fund/scheme.
2. "folio": The folio number.
3. "units": The number of units held (as a string to preserve decimal precision).
4. "invested_amount": The total cost or invested amount (as a string).
5. "current_value": The current value (as a string). If missing, leave as empty string "".

Return ONLY a valid JSON array of objects. Do not use markdown wrapping like \`\`\`json. If no funds are found, return [].

Raw Text:
${rawText}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanedText = responseText.replace(/```json\n/g, '').replace(/```/g, '').trim();
    
    const parsedData: ParsedFundData[] = JSON.parse(cleanedText);
    return parsedData;
  } catch (error) {
    console.error('AI Parsing Error:', error);
    throw new Error('Failed to structure the CAS data using AI.');
  }
}
