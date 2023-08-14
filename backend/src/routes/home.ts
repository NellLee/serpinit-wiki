
import express from "express";


const router = express.Router();

interface Article {
    title: string;
    content: string;
}

interface FantasyWorldWikiData {
    featuredArticle: Article;
    recentUpdates: string[];
}

const wikiData: FantasyWorldWikiData = {
    featuredArticle: {
        title: "The Legendary Sword of Eldoria",
        content: "The Legendary Sword of Eldoria is said to possess..."
    },
    recentUpdates: [
        "New character profiles added",
        "Exploration of the Elven Forest updated",
        "Bestiary expanded with new creatures"
    ],
};
// Render Handlebars template
router.get("/", (req, res) => {

    res.render('home', wikiData);
})


module.exports = router;