import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Anthropic } from "https://esm.sh/@anthropic-ai/sdk@0.18.0";

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY')!,
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS for browser requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    // 1. In a real scenario, we would fetch Gold Price API here
    const mockGoldPrice = 2034.50 + (Math.random() * 5); 

    // 2. The System Prompt for Claude
    const systemPrompt = `
      You are the CLOLD Sentinel. An autonomous AI guarding a digital gold vault.
      Your output must be JSON.
      Speak in a robotic, military-grade tone.
      Analyze the provided Gold Price and generate a status log under 15 words.
    `;

    // 3. Generate the specific output
    const completion = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: "user", content: `Gold Price is $${mockGoldPrice}. Current Status?` }
      ],
    });

    const aiResponse = completion.content[0].text;

    return new Response(
      JSON.stringify({
        message: aiResponse,
        metrics: {
          gold_price: mockGoldPrice,
          sentiment: mockGoldPrice > 2035 ? 'BULLISH' : 'NEUTRAL'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
