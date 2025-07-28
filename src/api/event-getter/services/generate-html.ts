import { DailyEvent } from '@prisma/client';

export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const generateHtmlPage = (event: DailyEvent): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(event.title)}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px;
      background-color: #f8f9fa;
      color: #333;
    }
    .event-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #eaeaea;
    }
    .event-title {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .event-time {
      color: #7f8c8d;
      font-size: 1.1em;
    }
    .event-image {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .event-description {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      margin-bottom: 25px;
      white-space: pre-wrap;
    }
    .wiki-link {
      display: inline-block;
      padding: 10px 20px;
      background: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s;
    }
    .wiki-link:hover {
      background: #2980b9;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #95a5a6;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="event-header">
    <h1 class="event-title">${escapeHtml(event.title)}</h1>
    <div class="event-time">${event.exactDate.toISOString().slice(0, 10)} at ${event.exactTime}</div>
  </div>
  
  <img src="${escapeHtml(event.imageUrl)}" alt="${escapeHtml(event.title)}" class="event-image">
  
  <div class="event-description">${escapeHtml(event.description)}</div>
  
  <div style="text-align: center">
    <a href="${escapeHtml(event.wikiLink)}" class="wiki-link" target="_blank">
      Read more on Wikipedia
    </a>
  </div>
  
  <div class="footer">
    Generated in real-time using AI • ${new Date().toLocaleString()}
  </div>
</body>
</html>
`;
};