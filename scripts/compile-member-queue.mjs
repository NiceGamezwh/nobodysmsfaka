import solc from "solc";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const require = createRequire(import.meta.url);
const ozRoot = path.dirname(
  require.resolve("@openzeppelin/contracts/package.json"),
);

const sourcePath = path.join(root, "contracts/MemberCardQueue.sol");
const source = fs.readFileSync(sourcePath, "utf8");

function findImports(importPath) {
  if (importPath.startsWith("@openzeppelin/contracts/")) {
    const rel = importPath.replace("@openzeppelin/contracts/", "");
    const full = path.join(ozRoot, rel);
    if (!fs.existsSync(full)) {
      return { error: "File not found: " + importPath };
    }
    return { contents: fs.readFileSync(full, "utf8") };
  }
  return { error: "File not found: " + importPath };
}

const input = {
  language: "Solidity",
  sources: { "MemberCardQueue.sol": { content: source } },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};

const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports }),
);
if (output.errors) {
  const fatal = output.errors.filter((e) => e.severity === "error");
  for (const e of output.errors) console.error(e.formattedMessage || e.message);
  if (fatal.length) process.exit(1);
}

const art = output.contracts["MemberCardQueue.sol"]["MemberCardQueue"];
const outDir = path.join(root, "contracts/out");
fs.mkdirSync(outDir, { recursive: true });
const artifact = {
  abi: art.abi,
  bytecode: "0x" + art.evm.bytecode.object,
};
fs.writeFileSync(
  path.join(outDir, "MemberCardQueue.json"),
  JSON.stringify(artifact, null, 2),
);
console.log("compiled ok, bytecode length", artifact.bytecode.length);
