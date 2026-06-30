/**
 * Words that are noise for attention analysis: English function words plus the
 * generic social-media / Instagram vocabulary that shows up everywhere and says
 * nothing about what a person actually keeps returning to.
 *
 * Kept deliberately conservative — we only strip words that are clearly filler,
 * so real interests ("ai", "coding", "fitness", "singing") survive.
 */
export const STOP_WORDS: ReadonlySet<string> = new Set([
  // articles / conjunctions / prepositions
  "the", "a", "an", "and", "or", "but", "if", "then", "else", "of", "to", "in",
  "on", "for", "with", "at", "by", "from", "up", "down", "out", "off", "about",
  "into", "onto", "over", "under", "again", "further", "once", "as", "than",
  "too", "very", "so", "no", "nor", "not", "only", "own", "same", "such",
  // pronouns
  "i", "me", "my", "mine", "we", "us", "our", "ours", "you", "your", "yours",
  "he", "him", "his", "she", "her", "hers", "it", "its", "they", "them",
  "their", "theirs", "this", "that", "these", "those", "who", "whom", "which",
  "what", "whose",
  // verbs / auxiliaries
  "is", "am", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "doing", "will", "would", "shall", "should", "can",
  "could", "may", "might", "must", "get", "got", "make", "made", "go", "going",
  "gone", "want", "wanted", "need", "know", "knows", "see", "look", "use",
  "used", "let", "lets",
  // adverbs / fillers
  "how", "when", "where", "why", "all", "any", "both", "each", "few", "more",
  "most", "other", "some", "every", "here", "there", "now", "just", "also",
  "even", "still", "well", "back", "much", "many", "lot", "lots", "really",
  "actually", "literally",
  // generic content-y filler
  "new", "best", "top", "tips", "tip", "guide", "way", "ways", "thing",
  "things", "day", "days", "time", "today", "year", "good", "great", "love",
  "free", "easy", "real", "true", "right", "wrong", "big", "small", "first",
  "last", "next", "part", "full", "watch", "check", "let's", "vs",
  // contraction fragments left behind when apostrophes are split out
  // (don't -> "don", i'll -> "ll", you're -> "re", i've -> "ve", etc.)
  "ll", "re", "ve", "don", "doesn", "didn", "won", "wouldn", "couldn",
  "shouldn", "isn", "aren", "wasn", "weren", "hasn", "haven", "hadn", "cant",
  "can't", "dont", "doesnt", "didnt", "wont", "im", "ive", "id", "youre",
  "youll", "youve", "youd", "theyre", "weve", "thats", "whats", "gonna",
  "wanna", "gotta",
  // number words
  "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "hundred", "thousand", "million", "billion",
  // social / Instagram noise
  "reel", "reels", "video", "videos", "instagram", "insta", "ig", "follow",
  "followers", "following", "like", "likes", "share", "comment", "comments",
  "save", "saved", "post", "posts", "content", "viral", "trending", "trend",
  "explore", "fyp", "foryou", "foryoupage", "page", "link", "bio", "dm",
  "story", "stories", "subscribe", "channel", "tiktok", "youtube", "edit",
  "viralreels", "trendingreels", "explorepage", "instagood", "instadaily",
  "reelsinstagram", "reelitfeelit", "reelkarofeelkaro", "viralvideo",
]);
