import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import sharp from "sharp";
import ts from "typescript";

const root = process.cwd();
const dataPath = path.join(root, "lib/data.ts");
const restaurantDir = path.join(root, "public/assets/restaurants");
const foodDir = path.join(root, "public/assets/foods");

fs.mkdirSync(foodDir, { recursive: true });

function loadRestaurants() {
  const source = fs.readFileSync(dataPath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const mod = new Module(dataPath);
  mod.paths = Module._nodeModulePaths(path.dirname(dataPath));
  mod._compile(output, dataPath);
  return mod.exports.RESTAURANTS;
}

function cropBox(width, height, index) {
  const cols = 4;
  const rows = 3;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const inset = Math.max(4, Math.round(Math.min(width / cols, height / rows) * 0.018));

  const x1 = Math.round((col * width) / cols) + inset;
  const y1 = Math.round((row * height) / rows) + inset;
  const x2 = Math.round(((col + 1) * width) / cols) - inset;
  const y2 = Math.round(((row + 1) * height) / rows) - inset;

  return {
    left: x1,
    top: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
}

const restaurants = loadRestaurants();
let dishCount = 0;

for (const restaurant of restaurants) {
  const sheetPath = path.join(restaurantDir, `${restaurant.slug}.png`);
  if (!fs.existsSync(sheetPath)) {
    throw new Error(`Missing generated sheet: ${sheetPath}`);
  }

  const heroPath = path.join(restaurantDir, `${restaurant.slug}.webp`);
  await sharp(sheetPath)
    .resize({ width: 1200, height: 800, fit: "cover", position: "top" })
    .webp({ quality: 84 })
    .toFile(heroPath);

  const metadata = await sharp(sheetPath).metadata();
  const dishes = restaurant.menu.flatMap((section) => section.items);
  if (dishes.length > 12) {
    throw new Error(`${restaurant.name} has ${dishes.length} dishes; the sheet cropper expects at most 12.`);
  }

  for (const [index, dish] of dishes.entries()) {
    const outputPath = path.join(foodDir, `${dish.id}.webp`);
    await sharp(sheetPath)
      .extract(cropBox(metadata.width, metadata.height, index))
      .resize(640, 640, { fit: "cover" })
      .webp({ quality: 86 })
      .toFile(outputPath);
    dishCount += 1;
  }
}

console.log(`Created ${dishCount} dish images and ${restaurants.length} restaurant hero images.`);
