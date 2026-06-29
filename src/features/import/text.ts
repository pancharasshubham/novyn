/**
 * Repair "mojibake" in Instagram export text.
 *
 * Instagram's export double-encodes text: the real bytes are UTF-8, but they're
 * written as if each byte were a Latin-1 character. So a curly quote (U+201C,
 * UTF-8 bytes E2 80 9C) arrives as three separate characters, and emoji turn
 * into runs of garbage. Reading the file as UTF-8 faithfully reproduces that.
 *
 * The fix is to reverse the mistake: treat each character as the single byte it
 * originally was, then decode that byte stream as UTF-8.
 *
 * We only attempt this when it's safe — i.e. every character already fits in a
 * single byte (0x00-0xFF). If the string contains any genuine multi-byte
 * character, it was decoded correctly and we leave it untouched.
 */
export function repairMojibake(text: string): string {
  let hasHighLatin1 = false;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    // A real character above 0xFF means the text was decoded correctly already.
    if (code > 0xff) return text;
    // High-Latin-1 bytes (0x80-0xFF) are the telltale sign of mojibake.
    if (code >= 0x80) hasHighLatin1 = true;
  }

  if (!hasHighLatin1) return text;

  try {
    const bytes = Uint8Array.from(text, (ch) => ch.charCodeAt(0));
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    // U+FFFD means the bytes weren't valid UTF-8 — the input wasn't mojibake
    // after all, so keep the original rather than introducing damage.
    return decoded.includes("�") ? text : decoded;
  } catch {
    return text;
  }
}
