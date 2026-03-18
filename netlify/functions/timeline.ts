import { Handler } from '@netlify/functions';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

function parseTimelineJson(raw: string): { nodes: any[]; edges: any[] } {
  let s = typeof raw === 'string' ? raw.trim() : '{}';
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    const parsed = JSON.parse(s);
    const nodes = Array.isArray(parsed?.nodes) ? parsed.nodes : [];
    const edges = Array.isArray(parsed?.edges) ? parsed.edges : [];
    return { nodes, edges };
  } catch {
    return { nodes: [], edges: [] };
  }
}

export const handler: Handler = async (event, context) => {

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { prompt, model } = body;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuration Error', details: 'GROQ_API_KEY is not set in Netlify environment variables.' })
      };
    }

    const normalizedPrompt = typeof prompt === 'string' ? prompt : '';
    const durationDaysMatch =
      normalizedPrompt.match(/(\d+)\s*(day|days)\b/i) ||
      normalizedPrompt.match(/\b(\d+)\s*-\s*day\b/i);
    const durationWeeksMatch = normalizedPrompt.match(/(\d+)\s*(week|weeks)\b/i);
    const durationDays = durationDaysMatch ? Number(durationDaysMatch[1]) : null;
    const durationWeeks = durationWeeksMatch ? Number(durationWeeksMatch[1]) : null;

    const timeboxText = durationDays
      ? `${durationDays} days`
      : durationWeeks
        ? `${durationWeeks} weeks`
        : null;

    const businessIntent = /\b(start( a)? business|start a startup|startup|entrepreneur|founder|launch|company|business plan|venture)\b/i.test(
      normalizedPrompt
    );

    const extractedProgramTheme = (() => {
      if (/\b(heartache|heart break|breakup|break-up)\b/i.test(normalizedPrompt)) return 'heartache';
      if (/\b(grief|loss|bereavement)\b/i.test(normalizedPrompt)) return 'grief';
      if (/\b(anxiety|panic)\b/i.test(normalizedPrompt)) return 'anxiety';
      if (/\b(depression)\b/i.test(normalizedPrompt)) return 'depression';
      return 'inner healing';
    })();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a Temporal Architect. Output ONLY a valid JSON object representing 3 distinct hybrid manifestation paths for a user's goal.

            SKILLS you must use (pick & combine based on the user's text):
            1) Healing Program Timeboxing: When the user provides a program length (e.g. "21 days", "3 weeks"), the first nodes in each path MUST reflect that timeboxed inner work/healing theme.
            2) Business Launch Roadmap: When the user indicates business/startup/entrepreneurship, the later nodes in each path MUST include milestones that lead to "start a business" (planning, building, launching).
            3) Long-Term Vision & Scale: When the user mentions long-term vision (or implicitly implies it via business goals), include a final node about sustaining/growing beyond launch.
            
            THE 3 PATHS:
            1. "The Steady Orbit" (Conservative/Low Risk): Focused on gradual, consistent growth.
            2. "The Warp Drive" (Balanced/Medium Risk): Focused on efficiency and moderate expansion.
            3. "The Quantum Leap" (Aggressive/High Risk): Focused on rapid, exponential breakthrough.
            
            STRUCTURE:
            {
              "nodes": [
                { "id": "path1-1", "label": "Text", "type": "milestone", "pathId": "steady" },
                { "id": "path2-1", "label": "Text", "type": "crossroad", "pathId": "warp" },
                { "id": "path3-1", "label": "Text", "type": "achievement", "pathId": "quantum" }
              ],
              "edges": [
                { "source": "path1-1", "target": "path1-2" }
              ]
            }
            
            RULES:
            1. Each path should have 3-5 unique nodes.
            2. The "pathId" field is MANDATORY for each node (values: "steady", "warp", "quantum").
            3. All paths should originate from the concept of the user's "Current Reality".
            4. Use distinct IDs for nodes in different paths.
            5. If the user includes a program length (days/weeks), timebox the first nodes to that duration using the detected length (e.g., "Days 1-21: ...", or "Weeks 1-3: ...").
            6. If the user includes business/startup intent, include at least one node in each path whose label explicitly contains one of: "start a business", "launch", "business launch", "found your company" (choose the closest wording).
            7. In the business+program case: the healing timeboxed nodes must appear before the business-start/launch nodes in each path.
            8. Include a "Long-Term Vision" style final node when business intent is present (even if the user only says "long term vision").
            9. Edges: connect the nodes within each path in an intuitive forward sequence (at least nodes_in_path - 1 edges total).
            10. Return ONLY valid JSON.`
          },
          {
            role: 'user',
            content: `Goal prompt: ${normalizedPrompt}
Timebox detected: ${timeboxText ?? 'none'}
Inner healing theme guess: ${extractedProgramTheme}
Business/startup intent detected: ${businessIntent ? 'yes' : 'no'}

Generate 3 hybrid manifestation paths that follow the rules and include healing timeboxing and business milestones as specified.`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'Groq API Error', details: errorData.error?.message || response.statusText })
      };
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';
    const { nodes, edges } = parseTimelineJson(rawContent);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ nodes, edges }),
    };
  } catch (error) {
    console.error('Timeline function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) })
    };
  }
};

