
export interface Timeline {
    version: string;
    timetype: string;
    categories: Category[];
    events: Event[];
}

export interface Category {
    name: string;
    color: string;
    progress_color: string;
    done_color: string;
    font_color: string;
    parent?: string;
}

export interface Event {
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
    labels?: string[] | string;
    default_color?: string;
}