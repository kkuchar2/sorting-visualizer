import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'docs/screenshots')
const port = Number(process.env.SCREENSHOT_PORT ?? 3012)
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? `http://localhost:${port}`
const manageServer = !process.env.SCREENSHOT_BASE_URL

const screenshots = [
  {
    file: 'bars.png',
    caption: 'Bar chart with shuffle and sort controls',
    setup: async (page) => {
      await selectVisualMode(page, 'Bars')
      await page.getByRole('button', { name: 'Shuffle' }).click()
      await waitForChart(page)
    },
  },
  {
    file: 'sorting.png',
    caption: 'Bubble sort in progress',
    setup: async (page) => {
      await selectAlgorithm(page, 'BubbleSort')
      await selectVisualMode(page, 'Bars')
      await page.getByRole('button', { name: 'Shuffle' }).click()
      await waitForChart(page)
      await page.getByRole('button', { name: 'Sort' }).click()
      await delay(350)
    },
  },
  {
    file: 'radial.png',
    caption: 'Radial view',
    setup: async (page) => {
      await selectVisualMode(page, 'Radial')
      await page.getByRole('button', { name: 'Shuffle' }).click()
      await waitForChart(page)
    },
  },
  {
    file: 'spiral.png',
    caption: 'Spiral view',
    setup: async (page) => {
      await selectVisualMode(page, 'Spiral')
      await page.getByRole('button', { name: 'Shuffle' }).click()
      await waitForChart(page)
    },
  },
  {
    file: 'image.png',
    caption: 'Image mode with counting sort',
    setup: async (page) => {
      await selectVisualMode(page, 'Image')
      await page.locator('#scramble-range').waitFor({ state: 'visible' })
      await waitForChart(page, 2500)
    },
  },
  {
    file: 'source-code.png',
    caption: 'Syntax-highlighted algorithm source',
    setup: async (page) => {
      await selectVisualMode(page, 'Bars')
      await page.getByRole('button', { name: 'View source' }).click()
      await page.locator('[role="dialog"]').waitFor({ state: 'visible' })
      await delay(1200)
    },
  },
]

async function waitForChart(page, extraDelay = 600) {
  await page.locator('canvas').waitFor({ state: 'visible' })
  await delay(extraDelay)
}

async function selectVisualMode(page, label) {
  await page.locator('#visual-mode-select').click()
  await page.locator('[role="listbox"] [role="option"]', { hasText: label }).click()
  await waitForChart(page)
}

async function selectAlgorithm(page, label) {
  await page.locator('#algorithm-select').click()
  await page.locator('[role="listbox"] [role="option"]', { hasText: label }).click()
  await delay(200)
}

async function waitForServer(url, timeoutMs = 120_000) {
  const started = Date.now()

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return
      }
    } catch {
      // Server still booting.
    }

    await delay(500)
  }

  throw new Error(`Timed out waiting for ${url}`)
}

function startDevServer() {
  const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
  const child = spawn(process.execPath, [nextBin, 'dev', '--webpack', '-p', String(port)], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' },
  })

  child.stdout?.on('data', (chunk) => process.stdout.write(chunk))
  child.stderr?.on('data', (chunk) => process.stderr.write(chunk))

  return child
}

async function captureScreenshots() {
  fs.mkdirSync(outDir, { recursive: true })

  const only = process.argv.slice(2)
  const targets = only.length > 0 ? screenshots.filter((shot) => only.includes(shot.file)) : screenshots

  if (targets.length === 0) {
    throw new Error(`No matching screenshots. Available: ${screenshots.map((shot) => shot.file).join(', ')}`)
  }

  const server = manageServer ? startDevServer() : null

  try {
    await waitForServer(baseUrl)

    const browser = await chromium.launch()
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
    })

    for (const shot of targets) {
      await page.goto(baseUrl, { waitUntil: 'networkidle' })
      await page.locator('h1', { hasText: 'Sorting visualizer' }).waitFor({ state: 'visible' })

      await shot.setup(page)

      const filePath = path.join(outDir, shot.file)
      await page.screenshot({ path: filePath, fullPage: true })
      console.log(`Saved ${path.relative(root, filePath)}`)
    }

    await browser.close()
  } finally {
    if (server) {
      server.kill('SIGTERM')

      await Promise.race([
        new Promise((resolve) => server.once('exit', resolve)),
        delay(5000).then(() => server.kill('SIGKILL')),
      ])
    }
  }
}

captureScreenshots().catch((error) => {
  console.error(error)
  process.exit(1)
})
