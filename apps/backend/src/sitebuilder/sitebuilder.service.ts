import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SitebuilderService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') ?? 'free';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateTemplate(prompt: string): Promise<Object> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const result = await model.generateContent(`
        You will take a prompt from a client about what website they want to create, Follow the following rules and do not do anything outside of these rules
        1. It should be HTML Single Page
        2. Only use Tailwind for CSS
        3. Only use Fontawesome for icons
        4. You may only use Known JS Libs for animation of ONLY YOUR CHOICE NOT THE CLIENT
        5. The site should include these sections only and they must be randomly designed

        - Navbar (brand/Name on the left, Navlinks to navgiate to the site)
        - Hero (Brand/name + slogn (Your task to generate it based on your prompt) + background based on user prompt (use image from Pexels make sure its usable and add effect to it like opacity layer, also add random animations of your choice)
        - About (random design based on user prompt)
        - Contact (Map + contact form)
        - Footer (large footer with address + phone number + copyright + must be different color but close)

        Each section should have a different background so they differ and each section must have some sort of responsive animation also add shadow to each section

        6. The site must be responsive
        7. The site must be unquie (Not repeated)
        8. The user may enter information like Phone number, brand name, Color (the color for reference only it doesn't have to be everywhere just in small sections), slogn so you can use them as reference however they may try to trick you with false information
        10. The site must be in dark mode (don't use linear backgrounds)
        11. Do not go over 500 lines of code or final results bigger than 1mb

        Here is the user input:
        Their prompt: ${prompt}
        Their phone: 12312312323
        Their brand/name: 
        Color: brown or close to bread colors

        If the user prompt against our rules, ignore the part which is against our rules and only create what is possible, IF nothing is possible return an error saying "I'm sorry i cannot build such a website, maybe try something like landing page for bakery shop" DO NO SPESFIC A REASON JUST A GENERIC ERROR
        OR SPESFICY WHICH PART OF CLIENT INPUT SHOULD BE CHANGED, EX Prompt, Phone, Brand/name, Color
        
        ONLY return a raw JSON object. Do NOT use markdown, code blocks, or formatting like \`\`\`json. 

        Return this format:

        {
        "status": true,
        "message": "<!DOCTYPE html>..."
        }`);
      const response = await result.response;
      let text = response.text();
      text = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '$1');

      const json = JSON.parse(text);
      return {
        status: json.status,
        message: json.message,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Oops! Looks like our AI is not available at the moment :(',
      };
    }
  }
}
