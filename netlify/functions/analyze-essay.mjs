export default async (request) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed." }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  try {
    const body = await request.json();

    const essay = body.essay?.trim();
    const writingType = body.writingType?.trim();
    const practicePrompt = body.practicePrompt?.trim();

    if (!essay || essay.length < 30) {
      return new Response(
        JSON.stringify({
          error: "Please enter at least a few sentences before requesting feedback."
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
const wordCount = essay.split(/\s+/).filter(Boolean).length;

if (wordCount > 1000) {
  return new Response(
    JSON.stringify({
      error: "Please keep the practice response under 1,000 words."
    }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" }
    }
  );
}
    if (essay.length > 6000) {
      return new Response(
        JSON.stringify({
          error: "Please keep the practice response under 6,000 characters for now."
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const prompt = `
You are GradePath AI, a supportive English writing coach for students preparing for CXC English A.

Give feedback on this ${writingType || "English writing"} response.

Practice prompt selected by the student:
${practicePrompt || "No prompt selected."}

Important rules:
- Do not write a full replacement essay.
- Do not claim to be an official CXC examiner.
- Do not guarantee grades or exam results.
- Be encouraging, specific, and age-appropriate.
- Focus on clarity, structure, examples, grammar, and sentence control.
- Give practical revision advice.
- Check how well the student answered the selected practice prompt and matched the writing type.
- Comment on ideas and organization, vocabulary and sentence variety, grammar, spelling, and punctuation.
Student response:
${essay}

Return your answer in this exact format:

STRENGTHS:
- bullet points

IMPROVE:
- bullet points

REVISION TASK:
One short paragraph telling the student exactly what to revise next.
`;

    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
max_output_tokens: 500,
input: prompt
      })
    });

    const data = await openAIResponse.json();

    if (!openAIResponse.ok) {
      console.error(data);

      return new Response(
        JSON.stringify({
          error: "The feedback service is unavailable right now. Please try again shortly."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({
        feedback: (data.output || [])
  .flatMap((item) => item.content || [])
  .filter((item) => item.type === "output_text")
  .map((item) => item.text)
  .join("\n")
  .trim()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "Something went wrong while preparing feedback."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
export const config = {
  path: "/.netlify/functions/analyze-essay",
  rateLimit: {
    windowLimit: 3,
    windowSize: 600,
    aggregateBy: ["ip", "domain"]
  }
};