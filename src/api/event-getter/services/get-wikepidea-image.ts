import axios from 'axios';
import * as cheerio from 'cheerio';

// You can replace this with your own fallback image URL
const FALLBACK_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png';

export async function getWikipediaImage(wikiUrl: string): Promise<string> {
  try {
    const { data } = await axios.get(wikiUrl);
    const $ = cheerio.load(data);

    let imageUrl = $('.infobox img').first().attr('src');

    if (!imageUrl) {
      imageUrl = $('.mw-parser-output img').first().attr('src');
    }

    if (imageUrl) {
      return `https:${imageUrl}`;
    }

    return FALLBACK_IMAGE;
  } catch (error) {
    console.error('Error fetching Wikipedia image:', error);
    return FALLBACK_IMAGE;
  }
}
