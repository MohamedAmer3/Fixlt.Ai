import { GoogleGenAI, Schema, Type } from "@google/genai";
import { FixItResponse } from "../types";

// Prompt for Gemini 3 Pro
const SYSTEM_INSTRUCTION = `
You are FixIt.AI, an expert Additive Manufacturing Engineer.
Your goal is to execute a "Chain of Repair" process on the provided image of a broken part.

1. ANALYZE: Identify the broken feature in the image (e.g., 'snapped axle', 'cracked mounting hole', 'sheared gear tooth').
2. MEASURE (ESTIMATE): Estimate logical metric dimensions based on visual context. If it looks like a screw hole, assume standard sizes (e.g., M3, M4, M5). Estimate overall bounding box dimensions.
3. STRATEGY: Do not just trace the broken shards. DESIGN A ROBUST REPLACEMENT OR REPAIR PART.
   - If a shaft is snapped, design a sleeve or a splint to connect them.
   - If a bracket is broken, design a reinforced bracket with thicker walls (min 2mm) and fillets to reduce stress concentrations.
   - Ensure the repair part is optimized for FDM 3D printing (e.g., flat bottom for bed adhesion, minimal overhangs/supports).

OUTPUT FORMAT:
Return a JSON object with exactly three fields:

1. 'technicalAnalysis': A detailed technical log. Start with ">> SCAN COMPLETE." Describe the damage, estimated dimensions, and the chosen repair strategy. Use engineering terminology combined with the "FixIt.AI" sci-fi system vibe (e.g., "STRUCTURAL INTEGRITY: CRITICAL FAILURE", "DIMENSIONAL ESTIMATION: M4 MOUNTS", "OPTIMIZATION ALGORITHM: REINFORCED BRACKET GENERATED").

2. 'openScadCode': Valid OpenSCAD code to generate the replacement part.
   - Use parametric variables at the top (e.g., 'hole_radius = 3;', 'wall_thickness = 2;').
   - Ensure the part is MANIFOLD (watertight).
   - Ensure it is oriented for printing (flat surface on Z=0).
   - Use $fn=100 for smooth circles.

3. 'threeJsCode': Valid JavaScript code using the global 'THREE' library to visualize this exact repair part.
   - CRITICAL: Do NOT create a scene, camera, or renderer.
   - CRITICAL: Assume a variable 'exportGroup' (type THREE.Group) already exists.
   - You MUST add all created meshes to 'exportGroup' using 'exportGroup.add(yourMesh)'.
   - Use 'THREE.MeshStandardMaterial' with color 0x00FFFF (Cyan), metalness: 0.6, roughness: 0.2.
   - Example: 
     const geo = new THREE.CylinderGeometry(5, 5, 20, 32);
     const mat = new THREE.MeshStandardMaterial({ color: 0x00FFFF, metalness: 0.6, roughness: 0.2 });
     const mesh = new THREE.Mesh(geo, mat);
     exportGroup.add(mesh);
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    technicalAnalysis: {
      type: Type.STRING,
      description: "Technical log of the analysis",
    },
    openScadCode: {
      type: Type.STRING,
      description: "The OpenSCAD source code",
    },
    threeJsCode: {
      type: Type.STRING,
      description: "The JavaScript code to generate THREE.js meshes",
    },
  },
  required: ["technicalAnalysis", "openScadCode", "threeJsCode"],
};

export const analyzeImage = async (base64Image: string): Promise<FixItResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Gemini 3 Pro Preview is best for complex coding and vision tasks
  const modelId = "gemini-3-pro-preview";

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: "image/jpeg", // Assuming JPEG for simplicity in this demo
            },
          },
          {
            text: "Perform Chain of Repair analysis. 1. Analyze damage. 2. Estimate dimensions. 3. Design replacement/fix. 4. Generate OpenSCAD and Three.js code.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as FixItResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};