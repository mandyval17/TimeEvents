import { ContentBlock, TextBlock } from '@anthropic-ai/sdk/resources/messages';

export function isTextBlock(block: ContentBlock): block is TextBlock {
  return block.type === 'text' && typeof (block as any).text === 'string';
}

export function parseTimeString(timeStr: string): { start: number, end: number } {
  // Handle single time format (HH:MM IST)
  const singleTimeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*IST/i);
  if (singleTimeMatch) {
    const hours = parseInt(singleTimeMatch[1]);
    const minutes = parseInt(singleTimeMatch[2]);
    const totalMinutes = hours * 60 + minutes;
    return { start: totalMinutes, end: totalMinutes };
  }

  // Handle time range format (HH:MM-HH:MM IST)
  const rangeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})\s*IST/i);
  if (rangeMatch) {
    const startHours = parseInt(rangeMatch[1]);
    const startMinutes = parseInt(rangeMatch[2]);
    const endHours = parseInt(rangeMatch[3]);
    const endMinutes = parseInt(rangeMatch[4]);

    return {
      start: startHours * 60 + startMinutes,
      end: endHours * 60 + endMinutes,
    };
  }

  throw new Error(`Invalid time format: ${timeStr}`);
}

export function validateEventTime(eventTime: string, clockHours: number, clockMinutes: number): boolean {
  try {
    const clockTotal = clockHours * 60 + clockMinutes;
    const { start, end } = parseTimeString(eventTime);

    console.log(`Clock: ${clockHours}:${clockMinutes}, clockTotal: ${clockTotal}, Event: ${eventTime}, Start: ${start}, End: ${end}`);

    // Allow 15-minute buffer before and after
    return (clockTotal >= start - 15) && (clockTotal <= end + 15);
  } catch (e) {
    console.error('Time validation error:', e);
    return false;
  }
}