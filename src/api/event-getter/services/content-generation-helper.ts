import { isTextBlock } from '../../../utils/helper-functions';
import { anthropic } from '../../utils/anthropic-client';

export const generateEventContent = async (time: string) => {

  const prompt = `Find a Wikipedia historical event that occurred:
    - Exactly at ${time} IST OR 
    - Time must be accurate per Wikipedia records, or can also include if the time is in between the events but not outside the event and this is the most important part, dont hallucinate
    - The clock time should be related to the event time, for example if the event is an interval in which the clock time falls that’s ok.  But clock time cannot be outside that. 

    Requirements:
    2. Convert all times to IST (Indian Standard Time)
    3. Include the exact time or time range in IST
    5. Include exact Date and time
    4. Provide a 300-word summary
    5. Format response as JSON:
    6. ALWAYS RETURN VALID JSON ONLY DONT INCLUDE ANYTHING ELSE THAN JSON NOT EVEN YOUR OWN RESPONSE
    7. Dont implant any text other than JSON
    8. Dont implant date on your own, scrape full date from Wikipedia and then only include it

    {
      "title": "Event Title",
      "description": "300-word summary",
      "imagePrompt": "Detailed image prompt",
      "wikiLink": "Wikipedia URL",
      "exactTime": "Exact time or time range in IST (e.g., '14:30 IST' or '14:00-15:00 IST')"
      "exactDate": "Exact date in YYYY-MM-DD format"
    }`;

  const aiRes = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const chatRes = aiRes.content
    .filter(isTextBlock)
    .map((block) => block.text)
    .join('\n');

  if (!chatRes) throw new Error('Empty Claude response');

  const cleanedJson = chatRes
    .replace(/```json\s*/gi, '')
    .replace(/```/g, '')
    .replace(/[\u0000-\u001F]+/g, ' ')
    .trim();

  return JSON.parse(cleanedJson);
};