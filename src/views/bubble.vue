<template>
  <div class="bubble-page">
    <h2>雲林縣 數據氣泡圖</h2>

    <div class="sections-grid">
      <div class="section section--power">
        <div class="section-header">
          <h3>發電量（已併聯）</h3>
          <div class="section-controls">
            <div class="legend-dot legend-dot--power">氣泡代表發電容量</div>
            <div class="total-chip total-chip--power">合計：{{ totalPower.toLocaleString() }} kW</div>
          </div>
        </div>
        <div id="bubbleMapPower" class="map"></div>
      </div>

      <div class="section section--tax">
        <div class="section-header">
          <h3>稅收（合計所得）</h3>
          <div class="section-controls">
            <div class="legend-dot legend-dot--tax">氣泡代表合計所得</div>
            <div class="year-group">
              <label>年份：</label>
              <select v-model="taxYear" @change="renderTaxBubbles">
                <option v-for="y in taxYearList" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
            <div class="total-chip total-chip--tax">合計：{{ totalTax.toLocaleString() }} 元</div>
          </div>
        </div>
        <div id="bubbleMapTax" class="map"></div>
      </div>

      <div class="section section--crop">
        <div class="section-header">
          <h3>農作物產量（111 年）</h3>
          <div class="section-controls">
            <div class="legend-dot legend-dot--crop">氣泡代表總產量</div>
            <div class="total-chip total-chip--crop">合計：{{ totalCrop.toLocaleString() }} 公斤</div>
          </div>
        </div>
        <div id="bubbleMapCrop" class="map"></div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Footer from '@/components/footer.vue'

// 三個地圖與圖層
let mapPower = null
let mapTax = null
let mapCrop = null
let outlinePower = null
let outlineTax = null
let outlineCrop = null
let bubblesPower = null
let bubblesTax = null
let bubblesCrop = null

const totalPower = ref(0)
const totalTax = ref(0)
const totalCrop = ref(0)

// 稅收年份
const taxYear = ref('')
const taxYearList = ref([])

// 資料集主色（R, G, B）
const COLOR_POWER = [59, 122, 236]   // 藍色
const COLOR_TAX = [255, 159, 64]     // 橘色
const COLOR_CROP = [3, 134, 134]     // 綠色

// 雲林各鄉鎮市清單（用於作物資料彙整）
const yunlinTowns = [
  '斗六市','土庫鎮','斗南鎮','北港鎮','虎尾鎮','西螺鎮',
  '大埤鄉','元長鄉','四湖鄉','口湖鄉','古坑鄉','台西鄉',
  '崙背鄉','東勢鄉','林內鄉','莿桐鄉','褒忠鄉','麥寮鄉'
]

let yunlinGeo = null

async function loadGeo() {
  if (yunlinGeo) return yunlinGeo
  const res = await fetch('/geo/yunlin-townships.geojson')
  yunlinGeo = await res.json()
  return yunlinGeo
}

async function initMap(containerId) {
  const map = L.map(containerId, { zoomControl: true, attributionControl: false }).setView([23.709, 120.431], 10)
  const geo = await loadGeo()
  const outline = L.geoJSON(geo, {
    style: () => ({ color: '#9aa4b2', weight: 1, fillOpacity: 0 })
  }).addTo(map)
  map.fitBounds(outline.getBounds(), { padding: [0, 0], maxZoom: 12 })
  return { map, outline }
}

function getFillColor(value, maxValue, baseRgb /* [r,g,b] */) {
  const [r, g, b] = baseRgb
  const minAlpha = 0.28
  const maxAlpha = 0.9
  if (!maxValue || maxValue <= 0) return `rgba(${r},${g},${b},0.45)`
  const ratio = Math.max(0, Math.min(1, value / maxValue))
  const alpha = minAlpha + (maxAlpha - minAlpha) * ratio
  return `rgba(${r},${g},${b},${alpha})`
}

function getRadiusByValue(value, maxValue) {
  const minR = 10
  const maxR = 40
  if (!maxValue || maxValue <= 0) return minR
  const ratio = Math.max(0, Math.min(1, value / maxValue))
  return minR + (maxR - minR) * Math.sqrt(ratio)
}

async function fetchPowerTownTotals() {
  const response = await fetch('https://soezsell.com/test-map/info.php?County=%E9%9B%B2%E6%9E%97%E7%B8%A3')
  const data = await response.json()
  const totals = {}
  data.forEach(item => {
    if (item.State === '已併聯') totals[item.Town] = parseFloat(item.CapacityValNow) || 0
  })
  return totals
}

async function fetchTaxTownTotals(year) {
  const res = await fetch(`https://map.soezsell.com/Get_tax_data.php?year=${year}`)
  const data = await res.json()
  const totals = {}
  data.filter(d => d.village_borough !== '合計').forEach(d => {
    const k = d.township_district
    const v = parseInt(d.total_income) || 0
    totals[k] = (totals[k] || 0) + v
  })
  return totals
}

async function fetchCropTownTotals(year = 111) {
  const totals = {}
  for (const town of yunlinTowns) {
    try {
      const encodedTown = encodeURIComponent(town)
      const r = await fetch(`https://map.soezsell.com/api_cropData.php?year=${year}&town=${encodedTown}`)
      const arr = await r.json()
      const sum = Array.isArray(arr) ? arr.reduce((acc, cur) => acc + (parseFloat(cur.total_yield) || 0), 0) : 0
      totals[town] = sum
    } catch (e) {
      totals[town] = 0
    }
  }
  return totals
}

function collectCenters(outline) {
  const centers = {}
  outline.eachLayer(l => {
    const town = l.feature?.properties?.town
    if (town) centers[town] = l.getBounds().getCenter()
  })
  return centers
}

function renderToMap(map, outline, existingGroup, townToValue, title, unit, baseRgb, strokeColor) {
  if (existingGroup) {
    try { existingGroup.clearLayers() } catch {}
    try { map.removeLayer(existingGroup) } catch {}
  }
  const group = L.layerGroup().addTo(map)

  const centers = collectCenters(outline)
  const values = Object.values(townToValue)
  const maxValue = values.length ? Math.max(...values) : 0

  Object.keys(centers).forEach(town => {
    const center = centers[town]
    const val = townToValue[town] || 0
    const fill = getFillColor(val, maxValue, baseRgb)
    const radius = getRadiusByValue(val, maxValue)

    const circle = L.circleMarker(center, {
      radius,
      color: strokeColor,
      weight: 1,
      fillColor: fill,
      fillOpacity: 0.9
    })

    circle.bindTooltip(`
      <div style=\"text-align:center;\">
        <strong>${town}</strong><br/>
        ${title}：${val.toLocaleString()} ${unit}
      </div>
    `)
    circle.addTo(group)
  })
  return group
}

async function renderPowerBubbles() {
  if (!mapPower || !outlinePower) return
  const totals = await fetchPowerTownTotals()
  totalPower.value = Object.values(totals).reduce((a, b) => a + (b || 0), 0)
  bubblesPower = renderToMap(mapPower, outlinePower, bubblesPower, totals, '發電容量', 'kW', COLOR_POWER, '#2f5fb6')
}

async function renderTaxBubbles() {
  if (!mapTax || !outlineTax || !taxYear.value) return
  const totals = await fetchTaxTownTotals(taxYear.value)
  totalTax.value = Object.values(totals).reduce((a, b) => a + (b || 0), 0)
  bubblesTax = renderToMap(mapTax, outlineTax, bubblesTax, totals, '合計所得', '元', COLOR_TAX, '#e1821d')
}

async function renderCropBubbles() {
  if (!mapCrop || !outlineCrop) return
  const totals = await fetchCropTownTotals(111)
  totalCrop.value = Object.values(totals).reduce((a, b) => a + (b || 0), 0)
  bubblesCrop = renderToMap(mapCrop, outlineCrop, bubblesCrop, totals, '農作物總產量', '公斤', COLOR_CROP, '#026d6d')
}

async function detectTaxYears() {
  try {
    const latestRes = await fetch('https://map.soezsell.com/Get_tax_data.php?year=110')
    const latestJson = await latestRes.json()
    let maxYear = 101
    if (latestJson && latestJson.length > 0) {
      maxYear = Math.max(...latestJson.map(i => parseInt(i.year) || 0), 101)
    }
    const years = []
    for (let y = 101; y <= maxYear; y++) years.push(y)
    taxYearList.value = years.reverse()
    taxYear.value = taxYearList.value[0]
  } catch (e) {
    taxYearList.value = [111, 110, 109, 108]
    taxYear.value = 111
  }
}

onMounted(async () => {
  const p = await initMap('bubbleMapPower')
  mapPower = p.map; outlinePower = p.outline

  const t = await initMap('bubbleMapTax')
  mapTax = t.map; outlineTax = t.outline

  const c = await initMap('bubbleMapCrop')
  mapCrop = c.map; outlineCrop = c.outline

  await detectTaxYears()

  await Promise.all([
    renderPowerBubbles(),
    renderTaxBubbles(),
    renderCropBubbles()
  ])

  setTimeout(() => {
    mapPower && mapPower.invalidateSize()
    mapTax && mapTax.invalidateSize()
    mapCrop && mapCrop.invalidateSize()
  }, 150)
})

watch(taxYear, async () => {
  await renderTaxBubbles()
})
</script>

<style scoped>
.bubble-page {
  padding: 14px;
  background: linear-gradient(180deg, #f7fafc 0%, #ffffff 100%);
}

h2 {
  margin: 10px 0 14px;
  color: #038686;
  text-align: center;
}

.sections-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.section:hover {
  box-shadow: 0 10px 26px rgba(0,0,0,0.08);
}

.section--power { border-left: 6px solid #3b7aec; }
.section--tax { border-left: 6px solid #ff9f40; }
.section--crop { border-left: 6px solid #038686; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 4px 0 10px;
}

.section-header h3 {
  margin: 0;
  color: #243b53;
  font-weight: 700;
}

.section-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-dot {
  font-size: 0.88em;
  color: #475569;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}
.legend-dot--power { border-color: #c7d7ff; background: #eef2ff; color: #2f5fb6; }
.legend-dot--tax { border-color: #ffe0b8; background: #fff4e5; color: #c46b00; }
.legend-dot--crop { border-color: #bfe7e7; background: #ecfdf5; color: #026d6d; }

.total-chip {
  font-size: 0.88em;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid transparent;
}
.total-chip--power { background: #eef2ff; color: #2f5fb6; border-color: #c7d7ff; }
.total-chip--tax { background: #fff4e5; color: #c46b00; border-color: #ffe0b8; }
.total-chip--crop { background: #ecfdf5; color: #026d6d; border-color: #bfe7e7; }

.year-group label { margin-right: 6px; color: #475569; }
.year-group select {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
}

#bubbleMapPower.map,
#bubbleMapTax.map,
#bubbleMapCrop.map {
  width: 100%;
  height: 420px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.04);
  background: #fff;
}

.legend.global-legend {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #555;
  font-size: 0.95em;
}
.legend-title { font-weight: 700; color: #038686; margin-bottom: 4px; }
.legend-row { display: flex; gap: 8px; }

@media (min-width: 1024px) {
  .sections-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  #bubbleMapPower.map,
  #bubbleMapTax.map,
  #bubbleMapCrop.map { height: 360px; }
}
</style> 