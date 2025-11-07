
import { GoogleGenAI, Type } from "@google/genai";
import { DagData } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getGeminiPrompt = (dagJson: DagData, userPrompt: string): string => {
    return `
You are an AI assistant that helps users edit a Causal Directed Acyclic Graph (DAG) for Marketing Mix Modeling.
Your task is to modify the provided JSON representation of the DAG based on the user's plain English command.

**Current DAG JSON:**
\`\`\`json
${JSON.stringify(dagJson, null, 2)}
\`\`\`

**User Command:**
"${userPrompt}"

**Instructions:**
1.  Analyze the user's command to understand the desired change (e.g., "add edge", "remove edge").
2.  Identify the source and target nodes mentioned. Node names in the command might be slightly different from the \`name\` field in the JSON (e.g., 'Google Spend' might correspond to a node named 'google_spend'). Use fuzzy matching and context to find the correct nodes from the \`nodes\` array.
3.  Modify the \`edges\` array in the provided JSON to reflect the user's command.

**For Adding an Edge:**
- Create a new edge object.
- The \`sourceNode\` and \`targetNode\` objects within the new edge MUST be exact, deep copies of the corresponding node objects from the main \`nodes\` array.
- Use a default \`weight\` of 1.0 unless specified.
- The edge \`type\` should be inferred from the user's command (e.g., 'Potential (Direct)', 'Forbidden'). Default to 'Potential (Direct)' if not specified.
- Add the new edge object to the \`edges\` array.

**For Removing an Edge:**
- Find the edge in the \`edges\` array that connects the specified source and target nodes.
- Remove that edge object from the \`edges\` array.

**Important Rules:**
- Your response MUST be ONLY the complete, updated JSON object for the "data" part of the DAG.
- Do NOT include any explanations, markdown formatting (like \`\`\`json\`), or any other text outside of the JSON object itself.
- The returned JSON must be valid and strictly adhere to the original structure.
- If the user's command is ambiguous, unclear, or refers to nodes that do not exist, return the original, unmodified JSON.
`;
};

export const updateDagWithGemini = async (currentDag: DagData, userPrompt: string): Promise<{ newDagData: DagData; fullPrompt: string }> => {
    try {
        const fullPrompt = getGeminiPrompt(currentDag, userPrompt);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const text = response.text.trim();
        const cleanedJsonText = text.replace(/^```json|```$/g, '').trim();

        const newDagData: DagData = JSON.parse(cleanedJsonText);
        
        // Basic validation
        if (!newDagData.nodes || !newDagData.edges) {
            throw new Error("Invalid DAG structure returned by AI.");
        }

        return { newDagData, fullPrompt };
    } catch (error) {
        console.error("Error processing Gemini request:", error);
        throw new Error("Failed to update DAG. The AI returned an invalid response.");
    }
};