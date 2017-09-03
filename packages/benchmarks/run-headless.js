const puppeteer = require('puppeteer')
const Chart = require('pwmetrics/lib/chart/chart')
const path = require('path')

// need to add a timeout if it never completes
// needs error handling

// the last benchmark that's run isn't included in the graph for some reason

async function run() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`file://${path.resolve(__dirname, './index.html')}`)

  const results = []
  page.on('console', result => {
    console.log(results)
    if (result && result.name) {
      results.push(result)
    }
    if (result === 'done') {
      browser.close()
      const chart = new Chart({
        xlabel: 'Time (ms)',
        ylabel: 'Benchmark',
        direction: 'x'
      })
      results.forEach(result => {
        chart.addBar({
          size: result.mean,
          label: /\[(.*)\]/.exec(result.name)[1],
          barLabel: `${result.mean}ms ${/(.*)\[/.exec(result.name)[1]}`
        })
      })
      chart.draw()
    }
  })
}

run()
