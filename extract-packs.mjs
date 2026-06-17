import { extractPack } from "@foundryvtt/foundryvtt-cli";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";

const rootDir = process.cwd();
const buildDir = path.resolve(rootDir, "build");
const manifestPath = path.resolve(rootDir, "module.json");
const foundryDataPathFile = path.resolve(rootDir, ".foundry-data-path");

const args = process.argv.slice(2);
const options = parseArgs(args);
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const moduleId = manifest.id;

const sourcePacksDir = await resolveSourcePacksDir({ moduleId, options });
const packFolders = await fs.readdir(sourcePacksDir, { withFileTypes: true });
const packNames = packFolders.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

if (!packNames.length) {
    throw new Error(`No pack folders found in ${sourcePacksDir}`);
}

const packFilter = new Set(options.packs);
const selectedPacks = options.packs.length ? packNames.filter((pack) => packFilter.has(pack)) : packNames;
const missingPacks = options.packs.filter((pack) => !packNames.includes(pack));
if (missingPacks.length) {
    throw new Error(`Requested pack(s) not found in ${sourcePacksDir}: ${missingPacks.join(", ")}`);
}

const replacer = (key, value) => {
    if (key === "createdTime") return undefined;
    if (key === "modifiedTime") return undefined;
    if (key === "lastModifiedBy") return undefined;
    return value;
};

console.log(`Extracting packs from: ${sourcePacksDir}`);
console.log("Cleaning packs");
await fs.mkdir(path.resolve(rootDir, "packs"), { recursive: true });
for (const pack of selectedPacks) {
    await fs.rm(path.resolve(rootDir, "packs", pack), { recursive: true, force: true });
}

for (const pack of selectedPacks) {
    console.log(`Extracting pack: ${pack}`);
    await extractPack(path.resolve(sourcePacksDir, pack), path.resolve(rootDir, "packs", pack), {
        jsonOptions: { replacer, space: 2 },
    });
}

console.log("Extraction Complete");

function parseArgs(argv) {
    const parsed = {
        dataPath: process.env.FOUNDRY_DATA_PATH,
        packs: [],
        source: process.env.FOUNDRY_PACKS_SOURCE,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === "--dataPath" || arg === "--data-path") {
            parsed.dataPath = readValue(argv, ++index, arg);
        } else if (arg === "--source") {
            parsed.source = readValue(argv, ++index, arg);
        } else if (arg === "--pack") {
            parsed.packs.push(readValue(argv, ++index, arg));
        } else if (arg.startsWith("--dataPath=")) {
            parsed.dataPath = arg.slice("--dataPath=".length);
        } else if (arg.startsWith("--data-path=")) {
            parsed.dataPath = arg.slice("--data-path=".length);
        } else if (arg.startsWith("--source=")) {
            parsed.source = arg.slice("--source=".length);
        } else if (arg.startsWith("--pack=")) {
            parsed.packs.push(arg.slice("--pack=".length));
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    return parsed;
}

function readValue(argv, index, flag) {
    const value = argv[index];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${flag}`);
    return value;
}

async function resolveSourcePacksDir({ moduleId, options }) {
    const candidates = [];
    if (options.source) candidates.push(path.resolve(rootDir, options.source));
    if (options.dataPath) candidates.push(path.resolve(options.dataPath, "modules", moduleId, "packs"));

    const storedDataPath = await readStoredFoundryDataPath();
    if (storedDataPath) candidates.push(path.resolve(storedDataPath, "modules", moduleId, "packs"));

    candidates.push(path.resolve(buildDir, "packs"));

    for (const candidate of candidates) {
        if (await isDirectory(candidate)) return candidate;
    }

    throw new Error(
        [
            "Could not find a compendium pack source directory.",
            "Run `npm run link` again, set FOUNDRY_DATA_PATH to your Foundry Data folder,",
            "or pass `npm run extractPacks -- --source /path/to/modules/elara/packs`.",
            `Checked: ${candidates.join(", ")}`,
        ].join(" "),
    );
}

async function readStoredFoundryDataPath() {
    if (!existsSync(foundryDataPathFile)) return undefined;
    const storedDataPath = (await fs.readFile(foundryDataPathFile, "utf8")).trim();
    return storedDataPath || undefined;
}

async function isDirectory(directory) {
    const stat = await fs.stat(directory).catch(() => undefined);
    return stat?.isDirectory() ?? false;
}
