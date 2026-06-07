import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing!');
    
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeSnippet(codeSnippet: string) {
    try {
      // 👇 Updated to 2.5-flash and locked into strict JSON mode!
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const prompt = `
        You are a senior developer code reviewer. Analyze the following code snippet.
        Return ONLY a valid JSON object with the following structure:
        {
          "summary": "A clear, one-sentence explanation of what this code does.",
          "tags": ["tag1", "tag2", "tag3"],
          "vulnerabilities": "Any security risks found, or 'None detected.'"
        }
        
        Code to analyze:
        ${codeSnippet}
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return JSON.parse(responseText);
      
    } catch (error) {
      console.error('AI Analysis Failed:', error);
      throw new InternalServerErrorException('Failed to analyze snippet with AI.');
    }
  }
}