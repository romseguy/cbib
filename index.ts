import Crawler from "simplecrawler";

const crawler = Crawler("http://localhost:3000");
crawler.userAgent = "Googlebot";

var exclude = [
  "gif",
  "jpg",
  "jpeg",
  "png",
  "ico",
  "bmp",
  "ogg",
  "webp",
  "mp4",
  "webm",
  "mp3",
  "ttf",
  "woff",
  "json",
  "rss",
  "atom",
  "gz",
  "zip",
  "rar",
  "7z",
  "css",
  "js",
  "gzip",
  "exe",
];
var exts = exclude.join("|");
var regex = new RegExp(".(" + exts + ")", "i"); // This is used for filtering crawl items.
crawler.addFetchCondition(function (parsedURL) {
  return !parsedURL.path.match(regex); // This will reject anything that's not a link.
});

crawler.start();

let pages = [];
crawler.on("fetchcomplete", function (item, responseBuffer, response) {
  console.log("🚀 ~ item:", item);
  //@ts-expect-error
  pages.push(item.url);
  console.log(pages);
});
