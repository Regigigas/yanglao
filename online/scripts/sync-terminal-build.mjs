import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, "..");
const terminalBuild = resolve(siteRoot, "..", "terminal", "dist", "build", "h5");
const target = resolve(siteRoot, "public", "terminal");

if (!existsSync(terminalBuild)) {
  throw new Error("Missing terminal H5 build. Run npm run build:h5 in terminal first.");
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(terminalBuild, target, { recursive: true });
