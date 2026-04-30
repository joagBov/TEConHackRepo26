type BehaviorSummary = {
  totalClicks: number;
  rageClicks: number;
  mashEvents: number;
  scrollCount: number;
  timeOnSiteSeconds: number;
};

let totalClicks = 0;
let rageClicks = 0;
let mashEvents = 0;
let scrollCount = 0;
let startTime = Date.now();

let lastClickTarget: EventTarget | null = null
let lastClickTime = 0
let repeatedClicks = 0

let keyTimes: number[] = []
let thresholdCallback: (() => void) | null = null
let thresholdFired = false

export function startTracker() {
  document.addEventListener("click", handleClick, { passive: true })
  document.addEventListener("keydown", handleKeyDown)
  document.addEventListener("scroll", handleScroll, { passive: true })
}

function handleClick(e: MouseEvent) {
  totalClicks++

  const now = Date.now()

  if (e.target === lastClickTarget && now - lastClickTime <= 500) {
    repeatedClicks++

    if (repeatedClicks >= 3) {
      rageClicks++
      checkThreshold()
    }
  } else {
    repeatedClicks = 1
    lastClickTarget = e.target
  }

  lastClickTime = now
}

function handleKeyDown() {
  const now = Date.now()

  keyTimes.push(now)
  keyTimes = keyTimes.filter((time) => now - time <= 300)

  if (keyTimes.length >= 5) {
    mashEvents++
    keyTimes = []
    checkThreshold()
  }
}

function handleScroll() {
  scrollCount++
}

function checkThreshold() {
  const summary = getSummary()

  if (
    !thresholdFired &&
    thresholdCallback &&
    (summary.rageClicks >= 2 || summary.timeOnSiteSeconds >= 20)
  ) {
    thresholdFired = true
    thresholdCallback()
  }
}

export function getSummary(): BehaviorSummary {
  return {
    totalClicks,
    rageClicks,
    mashEvents,
    scrollCount,
    timeOnSiteSeconds: Math.floor((Date.now() - startTime) / 1000),
  }
}

export function onThreshold(callback: () => void) {
  thresholdCallback = callback

  const timer = setInterval(() => {
    checkThreshold()
  }, 1000)

  return () => clearInterval(timer)
}

export function resetTracker() {
  totalClicks = 0
  rageClicks = 0
  mashEvents = 0
  scrollCount = 0
  startTime = Date.now()
  lastClickTarget = null
  lastClickTime = 0
  repeatedClicks = 0
  keyTimes = []
  thresholdFired = false
}