
export interface Image {
    full: string,
    thumbnail: string
}


export interface EventConfig { rect: RectangleConfig, text: TextConfig }

export interface EvCatPair { index: number, event: Event, category: Category }

interface RectangleConfig {
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
}
interface TextConfig {
  x: number,
  y: number,
  text: string,
  fontSize: number,
  fill: string,
}

export interface CategorizedTimeline {
    version: string
    timetype: string
    categories: Category[]
    events: Event[]
}

export interface Category {
    name: string
    color: string
    progress_color: string
    done_color: string
    font_color: string
    parent?: string
}

export interface Event {
    start: number
    end: number
    text: string
    fuzzy: boolean
    fuzzy_start: boolean
    fuzzy_end: boolean
    locked: boolean
    ends_today: boolean
    category: string
    description?: string
    labels?: string[] | string
    default_color?: string
}