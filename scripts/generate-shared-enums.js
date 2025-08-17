#!/usr/bin/env node
/**
 * Generates TypeScript enums from Prisma schema for the shared package
 * Run with: node scripts/generate-shared-enums.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PRISMA_SCHEMA_PATH = path.join(
  __dirname,
  "../backend/prisma/schema.prisma"
);
const OUTPUT_PATH = path.join(__dirname, "../shared/src/enums.ts");
const CACHE_PATH = path.join(__dirname, ".enum-cache.json");

// Generate hash of schema file for cache comparison
function generateSchemaHash(schemaContent) {
  return crypto.createHash("md5").update(schemaContent).digest("hex");
}

// Load cache data
function loadCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    }
  } catch (error) {
    console.warn("⚠️ Cache file corrupted, will regenerate:", error.message);
  }
  return null;
}

// Save cache data
function saveCache(hash, enumsCount) {
  const stats = fs.statSync(PRISMA_SCHEMA_PATH);
  const cacheData = {
    schemaHash: hash,
    schemaModified: stats.mtime.toISOString(),
    lastGenerated: new Date().toISOString(),
    enumsCount,
    generatedFile: OUTPUT_PATH,
  };
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cacheData, null, 2));
}

// Check if regeneration is needed
function shouldRegenerate(schemaContent, schemaHash) {
  // Force regeneration if --force flag is passed
  if (process.argv.includes("--force")) {
    console.log("🔄 Force regeneration requested...");
    return true;
  }

  const cache = loadCache();

  if (!cache) {
    console.log("📋 No cache found, generating enums...");
    return true;
  }

  if (!fs.existsSync(OUTPUT_PATH)) {
    console.log("📋 Output file missing, generating enums...");
    return true;
  }

  // Check file modification time as additional validation
  const stats = fs.statSync(PRISMA_SCHEMA_PATH);
  const currentModified = stats.mtime.toISOString();

  if (cache.schemaModified && cache.schemaModified !== currentModified) {
    console.log("📋 Prisma schema file modified, regenerating enums...");
    console.log(
      `   Previous modified: ${new Date(cache.schemaModified).toLocaleString()}`
    );
    console.log(
      `   Current modified:  ${new Date(currentModified).toLocaleString()}`
    );
    return true;
  }

  if (cache.schemaHash !== schemaHash) {
    console.log("📋 Prisma schema content changed, regenerating enums...");
    console.log(`   Previous hash: ${cache.schemaHash?.substring(0, 8)}...`);
    console.log(`   Current hash:  ${schemaHash.substring(0, 8)}...`);
    return true;
  }

  console.log("✅ Enums are up to date (cache hit)");
  console.log(
    `   Schema modified: ${new Date(cache.schemaModified).toLocaleString()}`
  );
  console.log(
    `   Last generated: ${new Date(cache.lastGenerated).toLocaleString()}`
  );
  console.log(`   Found ${cache.enumsCount} enums in cache`);
  return false;
}

function extractEnums(schemaContent) {
  const enumPattern = /enum\s+(\w+)\s*{([^}]+)}/g;
  const enums = {};

  let match;
  while ((match = enumPattern.exec(schemaContent)) !== null) {
    const enumName = match[1];
    const enumContent = match[2];

    const values = enumContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("//"))
      .map((line) => line.replace(/,$/, ""));

    enums[enumName] = values;
  }

  return enums;
}

function generateTypeScript(enums) {
  let content = "/**\n";
  content += " * Auto-generated enums from Prisma schema\n";
  content +=
    " * DO NOT EDIT MANUALLY - Run `npm run generate:enums` to regenerate\n";
  content += " */\n\n";

  for (const [enumName, values] of Object.entries(enums)) {
    content += `export enum ${enumName} {\n`;
    for (const value of values) {
      content += `  ${value} = "${value}",\n`;
    }
    content += "}\n\n";
  }

  content += "// Const arrays for zod validation\n";
  for (const [enumName, values] of Object.entries(enums)) {
    const constName = `${enumName.toUpperCase()}_VALUES`;
    content += `export const ${constName} = [${values
      .map((v) => `${enumName}.${v}`)
      .join(", ")}] as const;\n`;
  }
  content += "\n";

  content += "// Type aliases for easier usage\n";
  for (const [enumName] of Object.entries(enums)) {
    content += `export type ${enumName}Type = keyof typeof ${enumName};\n`;
  }

  return content;
}

function main() {
  try {
    // Check if Prisma schema exists
    if (!fs.existsSync(PRISMA_SCHEMA_PATH)) {
      console.error(`❌ Prisma schema not found: ${PRISMA_SCHEMA_PATH}`);
      process.exit(1);
    }

    // Read Prisma schema and generate hash
    const schemaContent = fs.readFileSync(PRISMA_SCHEMA_PATH, "utf8");
    const schemaHash = generateSchemaHash(schemaContent);

    // Check if regeneration is needed based on cache
    if (!shouldRegenerate(schemaContent, schemaHash)) {
      return; // Exit early if no changes detected
    }

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Extract enums
    const enums = extractEnums(schemaContent);

    if (Object.keys(enums).length === 0) {
      console.warn("⚠️ No enums found in Prisma schema");
      return;
    }

    console.log(`🔄 Generating ${Object.keys(enums).length} enums:`);
    for (const [name, values] of Object.entries(enums)) {
      console.log(`  - ${name}: ${values.length} values`);
    }

    // Generate TypeScript content
    const tsContent = generateTypeScript(enums);

    // Write to file
    fs.writeFileSync(OUTPUT_PATH, tsContent);

    // Save cache
    saveCache(schemaHash, Object.keys(enums).length);

    console.log(`\n✅ Generated enums file: ${OUTPUT_PATH}`);
    console.log("🎯 Enums are now ready for use in shared package!");
    console.log(`💾 Cache saved for future runs`);
  } catch (error) {
    console.error("❌ Error generating enums:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
