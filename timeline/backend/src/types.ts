interface Timeline {
  version: string;
  timetype: string;
  categories: {
    category: Category[];
  };
  events: {
    event: Event[];
  };
}

interface Category {
  name: string;
  color: string;
  progress_color: string;
  done_color: string;
  font_color: string;
  parent?: string;
}

interface Event {
  start: number;
  end: number;
  text: string;
  fuzzy: boolean;
  fuzzy_start: boolean;
  fuzzy_end: boolean;
  locked: boolean;
  ends_today: boolean;
  category: string;
  description?: string;
  labels?: string;
  default_color?: string;
}


// User Defined Type Guard to validate the format of the parsed object
function isValidTimelineData(data: any): data is Timeline {
  if (
      typeof data !== 'object' ||
      data === null ||
      !('version' in data) ||
      !('timetype' in data) ||
      !('categories' in data) ||
      !('events' in data)
  ) {
    return false;
  }

  if (
      typeof data.version !== 'string' ||
      typeof data.timetype !== 'string' ||
      !Array.isArray(data.categories.category) ||
      !Array.isArray(data.events.event)
  ) {
    return false;
  }

  for (const category of data.categories.category) {
    if (
        typeof category !== 'object' ||
        category === null ||
        typeof category.name !== 'string' ||
        typeof category.color !== 'string' ||
        typeof category.progress_color !== 'string' ||
        typeof category.done_color !== 'string' ||
        typeof category.font_color !== 'string' ||
        (category.parent && typeof category.parent !== 'string')
    ) {
      return false;
    }
  }

  for (const event of data.events.event) {
    if (
        typeof event !== 'object' ||
        event === null ||
        typeof event.start !== 'number' ||
        typeof event.end !== 'number' ||
        typeof event.text !== 'string' ||
        typeof event.fuzzy !== 'boolean' ||
        typeof event.fuzzy_start !== 'boolean' ||
        typeof event.fuzzy_end !== 'boolean' ||
        typeof event.locked !== 'boolean' ||
        typeof event.ends_today !== 'boolean' ||
        typeof event.category !== 'string' ||
        (event.description && typeof event.description !== 'string') ||
        (event.labels && typeof event.labels !== 'string') ||
        (event.default_color && typeof event.default_color !== 'string')
    ) {
      return false;
    }
  }

  return true;
}