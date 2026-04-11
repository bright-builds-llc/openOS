#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outputRoot = path.join(
  repoRoot,
  "output",
  "playwright",
  "readme-media",
);
const capturesDir = path.join(outputRoot, "captures");
const framesDir = path.join(outputRoot, "frames");
const trackedDir = path.join(repoRoot, "docs", "readme-media");
const driftSummaryPath = path.join(outputRoot, "drift-summary.md");

const trackedAssets = [
  "home-pages.png",
  "calculator.png",
  "settings.png",
  "notes.png",
  "browser.png",
  "launcher-flow.gif",
];

const args = new Set(process.argv.slice(2));
const shouldUpdateTracked = args.has("--update-tracked");
const shouldCheckTracked = args.has("--check-tracked");

async function ensureCleanOutput() {
  await fs.rm(outputRoot, { force: true, recursive: true });
  await fs.mkdir(capturesDir, { recursive: true });
  await fs.mkdir(framesDir, { recursive: true });
}

function getPnpmCommand() {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

function runCommand(command, commandArgs, maybeOptions = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: "inherit",
    ...maybeOptions,
  });

  if (result.status !== 0) {
    throw new Error(
      `Command failed: ${command} ${commandArgs.join(" ")}`,
    );
  }
}

function getArtifactPath(filename) {
  return path.join(outputRoot, filename);
}

function getTrackedPath(filename) {
  return path.join(trackedDir, filename);
}

async function buildAnimatedAssets() {
  const ffmpegResult = spawnSync("ffmpeg", ["-version"], {
    encoding: "utf8",
  });

  if (ffmpegResult.status !== 0) {
    throw new Error("ffmpeg is required to build README media.");
  }

  const frameSources = [
    "launcher-home.png",
    "launcher-home.png",
    "launcher-home.png",
    "launcher-home.png",
    "launcher-home.png",
    "launcher-calculator.png",
    "launcher-calculator.png",
    "launcher-calculator.png",
    "launcher-calculator.png",
    "launcher-calculator.png",
    "launcher-calculator.png",
    "launcher-home.png",
    "launcher-home.png",
    "launcher-home.png",
    "launcher-home.png",
    "launcher-home.png",
  ];

  for (const [frameIndex, frameSource] of frameSources.entries()) {
    await fs.copyFile(
      path.join(capturesDir, frameSource),
      path.join(
        framesDir,
        `launcher-flow-${String(frameIndex).padStart(2, "0")}.png`,
      ),
    );
  }

  runCommand("ffmpeg", [
    "-y",
    "-framerate",
    "12",
    "-i",
    path.join(framesDir, "launcher-flow-%02d.png"),
    "-vf",
    "fps=12,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
    getArtifactPath("launcher-flow.gif"),
  ]);

  runCommand("ffmpeg", [
    "-y",
    "-framerate",
    "12",
    "-i",
    path.join(framesDir, "launcher-flow-%02d.png"),
    "-vf",
    "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-pix_fmt",
    "yuv420p",
    getArtifactPath("launcher-flow.mp4"),
  ]);
}

async function copyTrackedAssets() {
  await fs.mkdir(trackedDir, { recursive: true });

  for (const asset of trackedAssets) {
    const sourcePath =
      asset === "launcher-flow.gif"
        ? getArtifactPath(asset)
        : path.join(capturesDir, asset);

    await fs.copyFile(sourcePath, getTrackedPath(asset));
  }
}

async function hashFile(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  return createHash("sha256").update(fileBuffer).digest("hex");
}

async function buildDriftSummary() {
  const driftLines = [];

  for (const asset of trackedAssets) {
    const generatedPath =
      asset === "launcher-flow.gif"
        ? getArtifactPath(asset)
        : path.join(capturesDir, asset);
    const trackedPath = getTrackedPath(asset);

    try {
      const [generatedHash, trackedHash] = await Promise.all([
        hashFile(generatedPath),
        hashFile(trackedPath),
      ]);

      if (generatedHash !== trackedHash) {
        driftLines.push(`- ${asset}: drift detected`);
      }
    } catch {
      driftLines.push(`- ${asset}: tracked asset missing`);
    }
  }

  const summary =
    driftLines.length === 0
      ? "# README media drift\n\nNo tracked-media drift detected.\n"
      : `# README media drift\n\n${driftLines.join("\n")}\n`;

  await fs.writeFile(driftSummaryPath, summary, "utf8");
  process.stdout.write(`${summary}\n`);
}

async function main() {
  await ensureCleanOutput();

  runCommand(getPnpmCommand(), [
    "exec",
    "playwright",
    "test",
    "tests/e2e/readme-media.spec.ts",
    "--project=webkit-iphone",
    "--workers=1",
  ], {
    env: {
      ...process.env,
      README_MEDIA_CAPTURE: "1",
      README_MEDIA_OUT_DIR: capturesDir,
    },
  });

  await buildAnimatedAssets();

  if (shouldUpdateTracked) {
    await copyTrackedAssets();
  }

  if (shouldCheckTracked) {
    await buildDriftSummary();
  }

  process.stdout.write(
    `README media generated in ${path.relative(repoRoot, outputRoot)}\n`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
