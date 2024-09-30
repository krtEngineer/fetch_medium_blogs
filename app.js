import * as cheerio from "cheerio";
import Parser from "rss-parser";

const parser = new Parser();

export async function convertRssToJson(userName) {
  let rssUrl = `https://medium.com/feed/@${userName}`;
  try {
    let blogs = [];
    const feed = await parser.parseURL(rssUrl);
    feed.items.map((item) => {
      let imgElement = extractElement(item["content:encoded"], "src");
      blogs.push({
        creator: item["creator"],
        title: item["title"],
        articleLink: item["guid"],
        date: item["isoDate"],
        categories: item["categories"],
        thumbnail: imgElement,
      });
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching or parsing RSS feed:", error);
    return null;
  }
}

function extractElement(html, attributeName) {
  const $ = cheerio.load(html);
  // Find the element with the given attribute name
  const element = $(`[${attributeName}]`);
  if (element) {
    return element.attr(attributeName);
  } else {
    return null;
  }
}
