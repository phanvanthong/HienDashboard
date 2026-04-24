// Custom Chart.js plugin: draw total above each stacked bar
import { fmtVND } from '../utils/formatters.js'

export const stackTotalPlugin = {
  id: 'stackTotal',
  afterDatasetsDraw(chart) {
    const opt = chart.config.options?.plugins?.stackTotal
    if (!opt?.display) return

    const { ctx, data } = chart
    const datasets = data.datasets
    if (!datasets.length) return
    const nBars = datasets[0].data.length

    const fmt = opt.formatter || fmtVND

    for (let i = 0; i < nBars; i++) {
      const total = datasets.reduce((sum, ds) => sum + (Number(ds.data[i]) || 0), 0)
      if (!total) continue

      // Find y-position of the top of the topmost visible bar segment
      let topY = null
      let barX = null
      for (let di = datasets.length - 1; di >= 0; di--) {
        const meta = chart.getDatasetMeta(di)
        if (meta.hidden) continue
        const el = meta.data[i]
        if (el) {
          topY = el.y
          barX = el.x
          break
        }
      }
      if (topY == null) continue

      ctx.save()
      ctx.font = `600 10px Inter, -apple-system, sans-serif`
      ctx.fillStyle = '#1d1d1f'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText(fmt(total), barX, topY - 4)
      ctx.restore()
    }
  },
}
