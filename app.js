const http = require("http");
const https = require("https");

const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/getTimeStories") {
    https.get("https://time.com", (timeResponse) => {
      let data = "";
      timeResponse.on("data", (chunk) => {
        data += chunk;
      });

      timeResponse.on("end", () => {
        const startIndex = data.indexOf('<div class="partial latest-stories"');
        const endIndex = data.indexOf("</ul>", startIndex);
        const latestStoriesHTML = data.substring(startIndex, endIndex);
        const storyItems = latestStoriesHTML.split(
          '<li class="latest-stories__item">'
        );
        const latestStories = [];

        for (
          let i = 1;
          i < storyItems.length && latestStories.length < 6;
          i++
        ) {
          const titleStart =
            storyItems[i].indexOf(
              '<h3 class="latest-stories__item-headline">'
            ) + '<h3 class="latest-stories__item-headline">'.length;
          const titleEnd = storyItems[i].indexOf("</h3>", titleStart);
          const title = storyItems[i].substring(titleStart, titleEnd).trim();

          const linkStart =
            storyItems[i].indexOf('<a href="') + '<a href="'.length;
          const linkEnd = storyItems[i].indexOf('">', linkStart);
          const link = storyItems[i].substring(linkStart, linkEnd);

          latestStories.push({ title, link });
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(latestStories));
      });
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
