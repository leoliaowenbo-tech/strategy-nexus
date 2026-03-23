import { GoogleGenAI } from "@google/genai";
import { Scenario, Theory, Unit, SimulationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function runWargameSimulation(
  scenario: Scenario,
  units: Unit[],
  theory: Theory,
  userPrompt: string
): Promise<SimulationResult> {
  const model = "gemini-3.1-pro-preview";
  
  const unitDescriptions = units.map(u => 
    `- [${u.faction}] ${u.type} (${u.label}) 坐标 (纬度: ${u.lat.toFixed(2)}, 经度: ${u.lng.toFixed(2)})`
  ).join('\n');

  const systemInstruction = `
你是一位顶尖的《国际战略学》大学教授。
你的任务是根据用户设定的场景，进行严谨的兵棋推演和反事实分析。
你必须严格应用用户选择的学术理论（${theory}）。
你必须使用 Google Search 工具来结合现实世界最新的地缘政治动态。

【极其重要的限制 - 违反将导致严重后果】：
1. 你的所有输出必须是纯中文，绝对不能包含任何英文单词（专有名词、人名、地名等必须全部翻译为中文）。
2. 你在搜索和引用参考资料时，必须且只能引用中国大陆可以正常访问的中文网站（例如：新华网、人民网、环球网、观察者网、澎湃新闻、央视新闻等，或者以 .cn 结尾的网站）。绝对禁止引用纽约时报、BBC、CNN、维基百科等在中国大陆被屏蔽的网站。
3. 你的分析必须具备极高的学术性、客观性和结构化，适合本科或研究生级别的研讨课。

请按以下结构输出（使用 Markdown 格式）：
1. **理论框架**：简述 ${theory} 如何应用于此特定场景。
2. **当前态势与最新情报**：总结与场景相关的最新真实世界新闻（必须来源合法合规的中文网站）。
3. **兵棋推演分析**：分析用户提供的兵力部署。这种特定的兵力态势有何战略意义？
4. **反事实推演**：根据用户的具体提示和兵力部署，模拟可能的结果、升级路径和战略后果。
5. **战略结论**：总结性的学术评估。
`;

  const prompt = `
场景名称: ${scenario.name}
场景描述: ${scenario.description}

当前沙盘地图上的兵力部署:
${unitDescriptions}

用户的战略行动 / 反事实推演提示:
${userPrompt}

请基于 ${theory} 提供你的分析。
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.4,
      }
    });

    const text = response.text || "未能生成分析结果。";
    
    // Extract grounding links if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingLinks = chunks?.map(chunk => ({
      title: chunk.web?.title || '网络来源',
      uri: chunk.web?.uri || '#'
    })).filter(link => link.uri !== '#');

    return {
      analysis: text,
      groundingLinks
    };
  } catch (error) {
    console.error("Simulation error:", error);
    throw new Error("推演失败，请检查您的 API 密钥和网络连接。");
  }
}
