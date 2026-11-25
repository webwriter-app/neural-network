import {
  Chart,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  ScatterController,
  Tooltip,
} from 'chart.js'

Chart.register(
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  ScatterController,
  Tooltip
)

const SERIES_COLORS = ['#1f77b4', '#ff7f0e']

// Charts drawn into a container, kept so that they are updated and destroyed
// instead of stacked.
const charts = new WeakMap<HTMLElement, Map<string, Chart>>()

function chartFor(
  container: HTMLElement,
  key: string,
  create: (canvas: HTMLCanvasElement) => Chart
): Chart {
  let byKey = charts.get(container)
  if (!byKey) {
    byKey = new Map()
    charts.set(container, byKey)
  }
  let chart = byKey.get(key)
  if (chart && chart.canvas.isConnected) return chart
  chart?.destroy()
  const wrapper = container.appendChild(document.createElement('div'))
  wrapper.style.position = 'relative'
  const canvas = wrapper.appendChild(document.createElement('canvas'))
  chart = create(canvas)
  byKey.set(key, chart)
  return chart
}

/** Removes the charts that were drawn into the container. */
export function clearCharts(container: HTMLElement): void {
  for (const chart of charts.get(container)?.values() ?? []) chart.destroy()
  charts.delete(container)
  container.replaceChildren()
}

/** Scatter plot of points in the container. */
export function renderScatter(
  container: HTMLElement,
  points: { x: number; y: number }[],
  xLabel: string,
  yLabel: string,
  series: string
): void {
  clearCharts(container)
  container.style.width = '350px'
  container.style.height = '240px'
  chartFor(container, 'scatter', (canvas) =>
    new Chart(canvas, {
      type: 'scatter',
      data: { datasets: [{ label: series, data: points, backgroundColor: SERIES_COLORS[0] }] },
      options: {
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { title: { display: true, text: xLabel } },
          y: { title: { display: true, text: yLabel } },
        },
      },
    })
  )
}

/**
 * Line charts of the training history: one chart per metric, with the
 * validation value (prefix val_) in the same chart.
 */
export function renderHistory(
  container: HTMLElement,
  history: Record<string, number>[],
  metrics: string[],
  xLabel: string
): void {
  for (const metric of metrics.filter((name) => !name.startsWith('val_'))) {
    const names = [metric, `val_${metric}`].filter(
      (name) => metrics.includes(name) && history.some((log) => name in log)
    )
    if (!names.length) continue
    const chart = chartFor(container, metric, (canvas) => {
      canvas.parentElement!.style.height = '100px'
      return new Chart(canvas, {
        type: 'line',
        data: { datasets: [] },
        options: {
          maintainAspectRatio: false,
          animation: false,
          scales: {
            x: { type: 'linear', title: { display: true, text: xLabel } },
          },
        },
      })
    })
    chart.data.datasets = names.map((name, index) => ({
      label: name,
      data: history.map((log, i) => ({ x: i + 1, y: log[name] })),
      borderColor: SERIES_COLORS[index],
      backgroundColor: SERIES_COLORS[index],
      pointRadius: 2,
    }))
    chart.update()
  }
}
