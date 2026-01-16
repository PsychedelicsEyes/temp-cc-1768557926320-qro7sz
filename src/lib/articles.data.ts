import articlesData from "@/data/articles.json"

export type ArticleBlock =
    | {
        type: "paragraph"
        text: string
    }
    | {
        type: "quote"
        text: string
    }
    | {
        type: "heading2"
        text: string
    }
    | {
        type: "heading3"
        text: string
    }
    | {
        type: "list"
        items: string[]
    }
    | {
        type: "ordered-list"
        items: string[]
    }
    | {
        type: "image"
        src: string
        alt?: string
        caption?: string
    }

export type Article = {
    slug: string
    title: string
    subtitle?: string
    excerpt?: string

    date: string
    readTime?: string
    author?: string
    tags?: string[]

    cover?: {
        src: string
        alt?: string
        caption?: string
    }

    paragraphs?: string[]

    blocks?: ArticleBlock[]

    sourceUrl?: string
}

export const ARTICLES = articlesData as Article[]
