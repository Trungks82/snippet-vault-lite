import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

/**
 * JSON mode guarantees the response is *valid JSON* — it does NOT
 * guarantee the JSON has the shape we asked for. The model could return
 * { "summary": null } or rename a key, and without this schema we would
 * write garbage straight into the database. Validate at the boundary:
 * everything past this point can trust the shape.
 */
const AiAnalysisSchema = z.object({
  summary: z.string().min(1),
  tags: z.array(z.string()).min(1).max(10),
  vulnerabilities: z.string().min(1),
});

export type AiAnalysis = z.infer<typeof AiAnalysisSchema>;

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing!');
    
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeSnippet(codeSnippet: string): Promise<AiAnalysis> {
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
      
      // Throws ZodError if the model went off-script -> caught below.
      return AiAnalysisSchema.parse(JSON.parse(responseText));
      
    } catch (error) {
      console.error('AI Analysis Failed:', error);
      throw new InternalServerErrorException('Failed to analyze snippet with AI.');
    }
  }
}