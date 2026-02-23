import fs from 'fs';
import path from 'path';

const SRC_DIR = 'f:/Birthdayofhyj/A';
const DEST_DIR = 'f:/Birthdayofhyj/A/tarot-web/public/cards';

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

// Read all files in source directory
const files = fs.readdirSync(SRC_DIR);

const cardsData = [];

files.forEach(file => {
  if (file.endsWith('.jpeg')) {
    const srcPath = path.join(SRC_DIR, file);
    const destPath = path.join(DEST_DIR, file);

    // Copy file
    fs.copyFileSync(srcPath, destPath);

    if (file === '卡背.jpeg') {
        return; // Skip back of card in metadata
    }

    // Parse filename: e.g., "00_The_Fool_愚者.jpeg"
    const nameWithoutExt = file.replace('.jpeg', '');
    const parts = nameWithoutExt.split('_');
    
    if (parts.length >= 3) {
      const id = parts[0]; // e.g., "00"
      const nameEn = parts.slice(1, parts.length - 1).join(' '); // "The Fool"
      const nameZh = parts[parts.length - 1]; // "愚者"
      
      let type = "unknown";
      let suit = null;
      let pip = null;
      let court = null;
      
      const idNum = parseInt(id, 10);
      if (idNum >= 0 && idNum <= 21) {
        type = "major";
      } else {
        type = "minor";
        // Attempt to determine suit and value from English name
        // E.g., "Ace of Wands", "Two of Cups", "Page of Swords", "King of Pentacles"
        const lowerName = nameEn.toLowerCase();
        if (lowerName.includes("wands")) suit = "wands";
        else if (lowerName.includes("cups")) suit = "cups";
        else if (lowerName.includes("swords")) suit = "swords";
        else if (lowerName.includes("pentacles")) suit = "pentacles";

        const valParts = lowerName.split(" of ");
        if (valParts.length > 0) {
            const val = valParts[0];
            if (["page", "knight", "queen", "king"].includes(val)) {
                court = val;
            } else {
                pip = val;
            }
        }
      }

      cardsData.push({
        id: id,
        nameEn: nameEn,
        nameZh: nameZh,
        type: type,
        suit: suit,
        pip: pip,
        court: court,
        image: `/cards/${file}`
      });
    }
  }
});

// Write to JSON
const outputJsonPath = path.join(DEST_DIR, 'cards.json');
fs.writeFileSync(outputJsonPath, JSON.stringify(cardsData, null, 2), 'utf-8');

console.log(`Successfully copied ${cardsData.length} cards + card back and generated cards.json at ${outputJsonPath}`);
