
import express from "express";
import path from "path";
import { EvCatPair, EventConfig, CategorizedTimeline } from "../scripts/types";
import { readFile } from "fs/promises";
import { parseString } from 'xml2js';
import { parseBooleans, parseNumbers } from "xml2js/lib/processors";
import { isTimeline } from "../scripts/types.guard";
import { JSDOM } from "jsdom";
let $: JQueryStatic;

const router = express.Router();








let timelinePath = path.join(__dirname + "/../../../timeline/Geschichte.timeline");
const config = {
  availableHeight: 600,
  availableWidth: 1200,
  eventHeight: 40,
}


router.get("/", async (req, res) => {

  console.log("Loading timeline...")
  const eventConfigs = await getEventConfigs();
  console.log("... Done!")

  res.render("timeline", {
    eventConfigs,
  })
})

async function getEventConfigs() {
  return await getEvCatPairs().then(evCatPairs => calculateEventConfigs(config, evCatPairs));
}


function getEvCatPairs(): Promise<EvCatPair[]> {
  return readFile(timelinePath).then(xml => {
    return parseTimeline(xml.toString());
  }).then((timeline: CategorizedTimeline) => {
    return timeline.events.map((event, index) => {
      const category = timeline.categories.find(
        (cat) => cat.name === event.category
      );
      if (category) {
        return { index, event, category };
      }
      return null
    }).filter(v => !!v) as EvCatPair[];
  })
}

function parseTimeline(xml: string): Promise<CategorizedTimeline> {
  return new Promise((resolve, reject) => {
    parseString(xml, { valueProcessors: [parseNumbers, parseBooleans, parseRgbs], explicitArray: false }, (err, result) => {
      result.timeline.categories = result.timeline.categories.category
      result.timeline.events = result.timeline.events.event


      if (err) {
        console.error('Error parsing XML:', err);
        reject(err)
        return;
      }

      const timeline = result.timeline;
      if (isTimeline(timeline)) {

        console.log('Valid timeline object');
        // console.log(timeline);
        resolve(timeline);
      } else {
        let message = 'Invalid timeline object format';
        console.error(message);
        reject(message)
      }
    });
  })

}

function calculateEventConfigs(config, evCatPairs: EvCatPair[]): Promise<EventConfig[]> {
  return new Promise((resolve, reject) => {
    const result: EventConfig[] = []
    for (let evCatPair of evCatPairs) {
      const event = evCatPair.event
      const category = evCatPair.category

      let rectX = config.originX + event.start
      let rectY = config.originY + 50 * evCatPair.index

      result.push({
        rect: {
          x: rectX,
          y: rectY,
          width: config.originX + (event.end - event.start) / config.availableWidth,
          height: 40,
          fill: category.color,
        },
        text: {
          x: rectX + 5,
          y: rectY + 3,
          text: event.text,
          fontSize: 14,
          fill: category.font_color,
        }
      })
    }

    if (result.length > 0) {
      resolve(result);
    } else {
      reject()
    }
  });
}


function parseRgbs(value: string) {
  if (/(\d{1,3}),(\d{1,3}),(\d{1,3})/.test(value)) {
    return `rgb(${value})`
  }
  return value;
}



module.exports = router;