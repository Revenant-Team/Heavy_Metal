import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

const predictPollutionSource = async (req, res) => {
  try {
    const { results } = req.body;
    const response = [];

    for (const result of results) {
      const pH = result.sampleInfo.pH;
      const state = result.location.state;
      const district = result.location.district;
      const iron =
        result.hmpiResult.metalContributions.iron?.concentration ?? null;
      const arsenic =
        result.hmpiResult.metalContributions.arsenic?.concentration ?? null;
      const lead =
        result.hmpiResult.metalContributions.lead?.concentration ?? null;
      const cadmium =
        result.hmpiResult.metalContributions.cadmium?.concentration ?? null;
      const chromium =
        result.hmpiResult.metalContributions.chromium?.concentration ?? null;
      const mercury =
        result.hmpiResult.metalContributions.mercury?.concentration ?? null;
      const nickel =
        result.hmpiResult.metalContributions.nickel?.concentration ?? null;
      const zinc =
        result.hmpiResult.metalContributions.zinc?.concentration ?? null;
      const hmpiValue = result.hmpiResult.value;
      const prompt = `
    You are an environmental scientist. You are given a water sample with measurements of heavy metals and water quality. Some heavy metals may not be measured. Based on the available data, predict the most likely pollution source and provide an explanation.

Water Sample Data:
- pH: ${pH}
- Metals (mg/L):
  - Iron: ${iron}
  - Arsenic: ${arsenic}
  - Lead: ${lead}
  - Cadmium: ${cadmium}
  - Chromium: ${chromium}
  - Mercury: ${mercury}       # If unknown or not measured, use "null"
  - Nickel: ${nickel}         # If unknown or not measured, use "null"
  - Zinc: ${zinc}             # If unknown or not measured, use "null"
- HMPI Value: ${hmpiValue}
- Location: ${state}, ${district}

Predict the pollution source among the following categories:
- Industrial
- Agricultural
- Natural
- Domestic

Instructions:
1. Take into account that some metals may not be measured.
2. Base your reasoning on the metals that are present and their concentrations.
3. Provide the output as JSON with three fields:
{
  "predictedSource": "Industrial",
  "confidence": 0.0-1.0,
  "explanation": "Explain why this source is most likely based on the metal concentrations and other features."
}
`;
      const airesponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      // Remove ```json and ``` from the content
      const jsonString = airesponse.text.replace(/```json|```/g, "").trim();
      let parsed = {};
      try {
        parsed = JSON.parse(jsonString);
      } catch (e) {
        parsed = { error: "Failed to parse AI response", raw: jsonString };
      }

      response.push({
        rowNumber: result.originalRowNumber,
        content: parsed,
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      error: "error while predicting the pollution source",
      message: error.message,
    });
  }
};

export { predictPollutionSource };
