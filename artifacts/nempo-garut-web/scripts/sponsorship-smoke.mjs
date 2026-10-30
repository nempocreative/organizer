import { createServer } from "node:net";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { chromium } from "playwright-core";

const appDirectory = new URL("../", import.meta.url);
const appPath = decodeURIComponent(appDirectory.pathname);
const chromiumPath = process.env.CHROMIUM_PATH ?? "/repl/tools/bin/chromium";
const routePath = "/sponsorship";
const viewports = [
  { width: 320, height: 900 },
  { width: 375, height: 900 },
  { width: 1280, height: 900 },
];

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForServer(url, processOutput) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Vite is still starting.
    }

    if (processOutput.exitCode !== null) {
      throw new Error(`Vite exited before becoming ready.\n${processOutput.logs.join("")}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw new Error(`Timed out waiting for ${url}.\n${processOutput.logs.join("")}`);
}

async function inspectViewport(page) {
  return page.evaluate(async () => {
    const tolerance = 1;
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const documentWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth ?? 0,
    );
    const targetGroups = [
      { selector: ".sponsor-button-primary", label: "primary hero CTA", all: false },
      { selector: ".sponsor-lineup-card", label: "hero lineup", all: false },
      { selector: ".sponsor-event-link", label: "event-card action", all: true },
    ];
    const failures = [];
    const targets = [];

    for (const group of targetGroups) {
      const elements = Array.from(document.querySelectorAll(group.selector));
      if (elements.length === 0) {
        failures.push(`${group.label} (${group.selector}) is missing`);
        continue;
      }

      for (const [index, element] of elements.entries()) {
        element.scrollIntoView({
          behavior: "instant",
          block: "center",
          inline: "nearest",
        });
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const rect = element.getBoundingClientRect();
        const label = group.all ? `${group.label} ${index + 1}` : group.label;
        const fits =
          rect.left >= -tolerance &&
          rect.right <= viewport.width + tolerance &&
          rect.top >= -tolerance &&
          rect.bottom <= viewport.height + tolerance;

        targets.push({
          label,
          bounds: {
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            top: Math.round(rect.top * 100) / 100,
            bottom: Math.round(rect.bottom * 100) / 100,
          },
          fits,
        });

        if (!fits) {
          failures.push(
            `${label} leaves the viewport ` +
              `(left=${rect.left.toFixed(1)}, right=${rect.right.toFixed(1)}, ` +
              `top=${rect.top.toFixed(1)}, bottom=${rect.bottom.toFixed(1)})`,
          );
        }
      }
    }

    if (documentWidth > viewport.width + tolerance) {
      failures.unshift(
        `document width ${documentWidth}px exceeds viewport width ${viewport.width}px`,
      );
    }

    return { documentWidth, viewport, targets, failures };
  });
}

async function main() {
  if (!existsSync(chromiumPath)) {
    throw new Error(
      `Chromium was not found at ${chromiumPath}. Set CHROMIUM_PATH to a compatible browser executable.`,
    );
  }

  let appProcess;
  let browser;
  let baseUrl = process.env.SPONSORSHIP_BASE_URL?.replace(/\/+$/, "");
  const processOutput = { exitCode: null, logs: [] };

  try {
    if (!baseUrl) {
      const port = await getFreePort();
      baseUrl = `http://127.0.0.1:${port}`;
      appProcess = spawn(
        "pnpm",
        ["exec", "vite", "--config", "vite.config.ts", "--host", "127.0.0.1", "--port", String(port)],
        { cwd: appPath, stdio: ["ignore", "pipe", "pipe"] },
      );
      appProcess.stdout.on("data", (chunk) => processOutput.logs.push(chunk.toString()));
      appProcess.stderr.on("data", (chunk) => processOutput.logs.push(chunk.toString()));
      appProcess.on("exit", (code) => {
        processOutput.exitCode = code;
      });
      await waitForServer(`${baseUrl}${routePath}`, processOutput);
    }

    browser = await chromium.launch({
      executablePath: chromiumPath,
      headless: true,
      args: ["--no-sandbox"],
    });

    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      try {
        await page.goto(`${baseUrl}${routePath}`, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".sponsor-hero", { state: "visible" });
        await page.evaluate(() => document.fonts?.ready);
        const result = await inspectViewport(page);

        if (result.failures.length > 0) {
          throw new Error(
            `${result.failures.join("; ")}\n` +
              `Measured targets: ${JSON.stringify(result.targets)}`,
          );
        }

        console.log(
          `PASS ${viewport.width}px: document ${result.documentWidth}px; ` +
            `${result.targets.length} required elements fit`,
        );
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser?.close();
    if (appProcess) {
      appProcess.kill("SIGTERM");
    }
  }
}

main().catch((error) => {
  console.error(`Sponsorship smoke check failed: ${error.message}`);
  process.exitCode = 1;
});