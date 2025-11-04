import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";

console.log("Starting simple build without FoundryVTT CLI...");

// Clean output directory, or create build directory
const outDir = path.resolve(process.cwd(), "build");
if (existsSync(outDir)) {
    const filesToClean = (await fs.readdir(outDir)).map((dirName) => path.resolve(outDir, dirName));
    for (const file of filesToClean) {
        await fs.rm(file, { recursive: true });
    }
} else {
    await fs.mkdir(outDir);
}

console.log("Clean Finished");

// Copy JSON files from packs (without compiling)
console.log("Copying pack files...");
const packFolders = await fs.readdir("packs");
console.log("Pack folders found:", packFolders);

for (const pack of packFolders) {
    const srcPath = `packs/${pack}`;
    const destPath = path.resolve(outDir, `packs/${pack}`);
    
    console.log(`Copying pack: ${pack}`);
    console.log(`  Source: ${srcPath}`);
    console.log(`  Destination: ${destPath}`);
    
    try {
        // Create destination directory
        await fs.mkdir(destPath, { recursive: true });
        
        // Copy all files (JSON files will be copied as-is for now)
        const files = await fs.readdir(srcPath);
        for (const file of files) {
            const srcFile = path.resolve(srcPath, file);
            const destFile = path.resolve(destPath, file);
            await fs.cp(srcFile, destFile);
        }
        
        console.log(`  Pack ${pack} copied successfully.`);
    } catch (err) {
        console.error(`  Error copying pack ${pack}:`, err);
    }
}

console.log("Build Packs Finished");

// Copy files and folders to output
const files = ["art", "lang", "module.json", "module", "templates"];
for (const file of files) {
    if (existsSync(file)) {
        await fs.cp(file, path.resolve(outDir, file), { recursive: true });
        console.log(`Copied: ${file}`);
    } else {
        console.log(`Skipped (not found): ${file}`);
    }
}

console.log("Simple Build Complete");
console.log(`Output directory: ${outDir}`);