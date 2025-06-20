import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface AICoachResponse {
  message: string;
  suggestions?: string[];
  analysisData?: any;
}

export async function getAICoachResponse(
  userMessage: string,
  userProfile: any
): Promise<AICoachResponse> {
  try {
    const systemPrompt = `You are an expert AI looksmaxxing coach. You provide personalized advice for physical self-improvement including skincare, fitness, nutrition, grooming, and style. 

User Profile:
- Age: ${userProfile.age || 'unknown'}
- Gender: ${userProfile.gender || 'unknown'}
- Height: ${userProfile.height || 'unknown'}cm
- Weight: ${userProfile.weight || 'unknown'}kg
- Skin Type: ${userProfile.skinType || 'unknown'}
- Hair Type: ${userProfile.hairType || 'unknown'}
- Goals: ${userProfile.goals?.join(', ') || 'general improvement'}
- Current Streak: ${userProfile.currentStreak || 0} days

Provide helpful, evidence-based advice. Be encouraging and supportive. Format your response as JSON with 'message' field and optional 'suggestions' array for actionable tips.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      message: result.message || "I'm here to help with your looksmaxxing journey!",
      suggestions: result.suggestions || [],
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
      suggestions: [],
    };
  }
}

export async function analyzeProgressPhoto(base64Image: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this progress photo for looksmaxxing purposes. Provide constructive feedback on skin condition, facial features, and improvement suggestions. Format as JSON with fields: skinClarity, overallScore, improvements, suggestions."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error("Image analysis error:", error);
    return {
      skinClarity: 0,
      overallScore: 0,
      improvements: [],
      suggestions: ["Unable to analyze image at this time."]
    };
  }
}
