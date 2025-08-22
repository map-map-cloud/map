<template>
  <div class="table-download-container">
    <h2>雲林縣資料表</h2>
    <div class="tab-bar">
      <button :class="{active: activeTab === 'power'}" @click="activeTab = 'power'">發電量資料</button>
      <button :class="{active: activeTab === 'tax'}" @click="activeTab = 'tax'">稅收資料</button>
      <button :class="{active: activeTab === 'crop'}" @click="activeTab = 'crop'">農作物產量</button>
    </div>
    <div v-if="activeTab === 'power'">
      <div class="state-filter filter-row">
        <span>狀態篩選：</span>
        <button v-for="state in states" :key="state" @click="selectedState = state"
          :class="{ active: selectedState === state }">
          {{ state }}
        </button>
        <div class="filter-download-btn">
          <button class="download-btn" @click="downloadTable">下載 CSV</button>
        </div>
      </div>
      <div class="table-section-with-download">
        <table class="data-table">
          <thead>
            <tr>
              <th @click="sortPowerTable('Town')" :class="{sorted: powerSortKey === 'Town'}">
                鄉鎮市
                <span v-if="powerSortKey === 'Town'">{{ powerSortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortPowerTable('State')" :class="{sorted: powerSortKey === 'State'}">
                狀態
                <span v-if="powerSortKey === 'State'">{{ powerSortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortPowerTable('Count')" :class="{sorted: powerSortKey === 'Count'}">
                案場數量
                <span v-if="powerSortKey === 'Count'">{{ powerSortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortPowerTable('CapacityValNow')" :class="{sorted: powerSortKey === 'CapacityValNow'}">
                發電容量 (kW)
                <span v-if="powerSortKey === 'CapacityValNow'">{{ powerSortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortedPowerData" :key="item.Town + item.State">
              <td>{{ item.Town }}</td>
              <td>{{ item.State }}</td>
              <td>{{ item.Count }}</td>
              <td>{{ parseFloat(item.CapacityValNow).toLocaleString() }}</td>
            </tr>
            <tr class="power-sum-row">
              <td colspan="2">加總</td>
              <td>{{ sumPower('Count') }}</td>
              <td>{{ sumPower('CapacityValNow') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="activeTab === 'tax'">
      <div class="tax-filter filter-row">
        <span>年份：</span>
        <select v-model="selectedTaxYear" @change="fetchTaxData">
          <option v-for="y in yearList" :key="y" :value="y">{{ y }}</option>
        </select>
        <span>縣市：</span>
        <select v-model="taxFilter.county_city">
          <option value="">全部</option>
          <option v-for="c in countyList" :key="c" :value="c">{{ c }}</option>
        </select>
        <span>鄉鎮市區：</span>
        <select v-model="taxFilter.township_district">
          <option value="">全部</option>
          <option v-for="t in townshipList" :key="t" :value="t">{{ t }}</option>
        </select>
        <span>村里：</span>
        <select v-model="taxFilter.village_borough">
          <option value="">全部</option>
          <option v-for="v in villageList" :key="v" :value="v">{{ v }}</option>
        </select>
        <div class="filter-download-btn">
          <button class="download-btn" @click="downloadTaxTable">下載 CSV</button>
        </div>
      </div>
      <div class="table-section-with-download">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="col in taxColumns" :key="col.key" @click="sortTaxTable(col.key)" :class="{sorted: taxSortKey === col.key}">
                  {{ col.label }}
                  <span v-if="taxSortKey === col.key">{{ taxSortOrder === 'asc' ? '▲' : '▼' }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sortedTaxData" :key="item.id">
                <td v-for="col in taxColumns" :key="col.key">{{ formatTaxCell(item, col.key) }}</td>
              </tr>
              <tr class="tax-sum-row">
                <td colspan="4">加總</td>
                <td>{{ sumTax('tax_units') }}</td>
                <td>{{ sumTax('total_income') }}</td>
                <td>{{ sumTax('profit_income') }}</td>
                <td>{{ sumTax('professional_income') }}</td>
                <td>{{ sumTax('salary_income') }}</td>
                <td>{{ sumTax('interest_income') }}</td>
                <td>{{ sumTax('rental_royalty_income') }}</td>
                <td>{{ sumTax('property_transaction_income') }}</td>
                <td>{{ sumTax('windfall_gain_income') }}</td>
                <td>{{ sumTax('dividend_income') }}</td>
                <td>{{ sumTax('retirement_income') }}</td>
                <td>{{ sumTax('other_income') }}</td>
                <td>{{ sumTax('declared_greater_than_grouped') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'crop'">
      <div class="state-filter filter-row">
        <span>年份：</span>
        <select v-if="cropYearList.length > 0" v-model="selectedCropYear" @change="fetchCropData">
          <option v-for="y in cropYearList" :key="y" :value="y">{{ y }}</option>
        </select>
        <span v-else style="color:#888;">查無年份資料</span>
        <span>鄉鎮市：</span>
        <select v-model="selectedCropTown" @change="fetchCropData">
          <option v-for="town in cropTownList" :key="town" :value="town">{{ town }}</option>
        </select>
        <div class="filter-download-btn">
          <button class="download-btn" @click="downloadCropTable">下載 CSV</button>
        </div>
      </div>
      <div class="table-section-with-download">
        <table class="data-table">
          <thead>
            <tr>
              <th @click="sortCropTable('crop_name')" :class="{sorted: cropSortKey === 'crop_name'}">
                作物名稱
                <span v-if="cropSortKey === 'crop_name'">{{ cropSortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortCropTable('planting_area')" :class="{sorted: cropSortKey === 'planting_area'}">
                種植面積(公頃)
                <span v-if="cropSortKey === 'planting_area'">{{ cropSortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortCropTable('harvest_area')" :class="{sorted: cropSortKey === 'harvest_area'}">
                收穫面積(公頃)
                <span v-if="cropSortKey === 'harvest_area'">{{ cropSortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortCropTable('yield_per_hectare')" :class="{sorted: cropSortKey === 'yield_per_hectare'}">
                每公頃產量(公斤)
                <span v-if="cropSortKey === 'yield_per_hectare'">{{ cropSortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortCropTable('total_yield')" :class="{sorted: cropSortKey === 'total_yield'}">
                總產量(公斤)
                <span v-if="cropSortKey === 'total_yield'">{{ cropSortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="sortedCropData.length === 0">
              <td colspan="5" style="text-align:center; color:#888;">查無資料</td>
            </tr>
            <tr v-for="crop in sortedCropData" :key="crop.crop_code">
              <td>{{ crop.crop_name }}</td>
              <td>{{ parseFloat(crop.planting_area).toLocaleString() }}</td>
              <td>{{ parseFloat(crop.harvest_area).toLocaleString() }}</td>
              <td>{{ parseFloat(crop.yield_per_hectare).toLocaleString() }}</td>
              <td>{{ parseFloat(crop.total_yield).toLocaleString() }}</td>
            </tr>
            <tr class="crop-sum-row" v-if="sortedCropData.length > 0">
              <td>加總</td>
              <td>{{ sumCrop('planting_area') }}</td>
              <td>{{ sumCrop('harvest_area') }}</td>
              <td>{{ sumCrop('yield_per_hectare') }}</td>
              <td>{{ sumCrop('total_yield') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const activeTab = ref('power')

// 發電量資料
const townData = ref([])
const selectedState = ref('全部')
const states = ref(['全部', '已併聯', '施工中', '申請中'])

// 排序狀態
const powerSortKey = ref('')
const powerSortOrder = ref('desc')

const sortedPowerData = computed(() => {
  let arr = [...filteredTownData.value]
  if (!powerSortKey.value) return arr
  return arr.sort((a, b) => {
    let valueA = a[powerSortKey.value]
    let valueB = b[powerSortKey.value]
    if (powerSortKey.value === 'Town' || powerSortKey.value === 'State') {
      if (powerSortOrder.value === 'asc') {
        return valueA.localeCompare(valueB, 'zh-TW')
      } else {
        return valueB.localeCompare(valueA, 'zh-TW')
      }
    } else {
      valueA = parseFloat(valueA)
      valueB = parseFloat(valueB)
      if (powerSortOrder.value === 'asc') {
        return valueA - valueB
      } else {
        return valueB - valueA
      }
    }
  })
})

function sortPowerTable(key) {
  if (powerSortKey.value === key) {
    powerSortOrder.value = powerSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    powerSortKey.value = key
    powerSortOrder.value = 'desc'
  }
}

const filteredTownData = computed(() => {
  if (selectedState.value === '全部') {
    return townData.value
  }
  return townData.value.filter(item => item.State === selectedState.value)
})

function downloadTable() {
  // 將 filteredTownData 轉為 CSV 字串
  const header = ['鄉鎮市', '狀態', '案場數量', '發電容量 (kW)']
  const rows = sortedPowerData.value.map(item => [
    item.Town,
    item.State,
    item.Count,
    parseFloat(item.CapacityValNow)
  ])
  const csvContent = [header, ...rows].map(e => e.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', '雲林縣鄉鎮市發電量資料表.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 稅收資料
const taxData = ref([])
const taxFilter = ref({ county_city: '', township_district: '', village_borough: '' })
const selectedTaxYear = ref('')
const yearList = ref([])

// 稅收表格排序
const taxSortKey = ref('')
const taxSortOrder = ref('desc')

const taxColumns = [
  { key: 'year', label: '年度' },
  { key: 'county_city', label: '縣市' },
  { key: 'township_district', label: '鄉鎮市區' },
  { key: 'village_borough', label: '村里' },
  { key: 'tax_units', label: '納稅單位(戶)' },
  { key: 'total_income', label: '合計所得' },
  { key: 'profit_income', label: '營利所得' },
  { key: 'professional_income', label: '執行業務所得' },
  { key: 'salary_income', label: '薪資所得' },
  { key: 'interest_income', label: '利息所得' },
  { key: 'rental_royalty_income', label: '租賃及權利金所得' },
  { key: 'property_transaction_income', label: '財產交易所得' },
  { key: 'windfall_gain_income', label: '機會中獎所得' },
  { key: 'dividend_income', label: '股利所得' },
  { key: 'retirement_income', label: '退職所得' },
  { key: 'other_income', label: '其他所得' },
  { key: 'declared_greater_than_grouped', label: '申報大於歸戶' }
]

const countyList = computed(() => Array.from(new Set(taxData.value.map(i => i.county_city).filter(Boolean))))
const townshipList = computed(() => Array.from(new Set(taxData.value.filter(i => !taxFilter.value.county_city || i.county_city === taxFilter.value.county_city).map(i => i.township_district).filter(Boolean))))
const villageList = computed(() => Array.from(new Set(taxData.value.filter(i => (!taxFilter.value.county_city || i.county_city === taxFilter.value.county_city) && (!taxFilter.value.township_district || i.township_district === taxFilter.value.township_district)).map(i => i.village_borough).filter(Boolean))))

const filteredTaxData = computed(() => {
  return taxData.value.filter(item =>
    (!taxFilter.value.county_city || item.county_city === taxFilter.value.county_city) &&
    (!taxFilter.value.township_district || item.township_district === taxFilter.value.township_district) &&
    (!taxFilter.value.village_borough || item.village_borough === taxFilter.value.village_borough) &&
    item.village_borough !== '合計'
  )
})

const sortedTaxData = computed(() => {
  let arr = [...filteredTaxData.value]
  if (!taxSortKey.value) return arr
  return arr.sort((a, b) => {
    let valueA = a[taxSortKey.value]
    let valueB = b[taxSortKey.value]
    if (typeof valueA === 'string') {
      if (taxSortOrder.value === 'asc') {
        return valueA.localeCompare(valueB, 'zh-TW')
      } else {
        return valueB.localeCompare(valueA, 'zh-TW')
      }
    } else {
      valueA = parseFloat(valueA)
      valueB = parseFloat(valueB)
      if (taxSortOrder.value === 'asc') {
        return valueA - valueB
      } else {
        return valueB - valueA
      }
    }
  })
})

function sortTaxTable(key) {
  if (taxSortKey.value === key) {
    taxSortOrder.value = taxSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    taxSortKey.value = key
    taxSortOrder.value = 'desc'
  }
}

function formatTaxCell(item, key) {
  // 只對數值欄位加千分位
  if ([
    'tax_units','total_income','profit_income','professional_income','salary_income','interest_income','rental_royalty_income','property_transaction_income','windfall_gain_income','dividend_income','retirement_income','other_income','declared_greater_than_grouped'
  ].includes(key)) {
    return Number(item[key]).toLocaleString()
  }
  return item[key]
}

function sumTax(key) {
  return filteredTaxData.value.reduce((sum, item) => sum + (parseInt(item[key]) || 0), 0).toLocaleString()
}

async function fetchTaxData() {
  if (!selectedTaxYear.value) return
  try {
    const taxRes = await fetch(`https://map.soezsell.com/Get_tax_data.php?year=${selectedTaxYear.value}`)
    const taxJson = await taxRes.json()
    taxData.value = taxJson
  } catch (error) {
    console.error('無法獲取稅收資料:', error)
  }
}

function downloadTaxTable() {
  const header = taxColumns.map(col => col.label)
  const rows = sortedTaxData.value.map(item => taxColumns.map(col => item[col.key]))
  const csvContent = [header, ...rows].map(e => e.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', `雲林縣稅收資料_${selectedTaxYear.value}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function sumPower(key) {
  if (key === 'Count') {
    return filteredTownData.value
      .reduce((sum, item) => sum + (parseInt(item.Count) || 0), 0)
      .toLocaleString()
  }
  if (key === 'CapacityValNow') {
    return filteredTownData.value
      .reduce((sum, item) => sum + (parseFloat(item.CapacityValNow) || 0), 0)
      .toLocaleString()
  }
  return ''
}

function sumCrop(key) {
  return cropData.value
    .reduce((sum, item) => sum + (parseFloat(item[key]) || 0), 0)
    .toLocaleString()
}

function downloadCropTable() {
  const header = ['作物名稱', '種植面積(公頃)', '收穫面積(公頃)', '每公頃產量(公斤)', '總產量(公斤)']
  const rows = sortedCropData.value.map(crop => [
    crop.crop_name,
    parseFloat(crop.planting_area),
    parseFloat(crop.harvest_area),
    parseFloat(crop.yield_per_hectare),
    parseFloat(crop.total_yield)
  ])
  const csvContent = [header, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  const year = selectedCropYear.value || '未指定年份'
  const town = selectedCropTown.value || '未指定鄉鎮'
  link.setAttribute('download', `雲林縣_${town}_${year}_農作物產量.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 農作物產量資料
const cropData = ref([])
const cropYearList = ref([])
const selectedCropYear = ref('')
const cropTownList = ref([
  '斗六市','土庫鎮','斗南鎮','北港鎮','虎尾鎮','西螺鎮','大埤鄉','元長鄉','四湖鄉','口湖鄉','古坑鄉','台西鄉','崙背鄉','東勢鄉','林內鄉','莿桐鄉','褒忠鄉','麥寮鄉'
])
const selectedCropTown = ref('斗六市')
const cropSortKey = ref('total_yield')
const cropSortOrder = ref('desc')
const sortedCropData = computed(() => {
  return [...cropData.value].sort((a, b) => {
    let valueA, valueB
    if (cropSortKey.value === 'crop_name') {
      valueA = a[cropSortKey.value]
      valueB = b[cropSortKey.value]
      if (cropSortOrder.value === 'asc') {
        return valueA.localeCompare(valueB, 'zh-TW')
      } else {
        return valueB.localeCompare(valueA, 'zh-TW')
      }
    } else {
      valueA = parseFloat(a[cropSortKey.value])
      valueB = parseFloat(b[cropSortKey.value])
      if (cropSortOrder.value === 'asc') {
        return valueA - valueB
      } else {
        return valueB - valueA
      }
    }
  })
})
function sortCropTable(key) {
  if (cropSortKey.value === key) {
    cropSortOrder.value = cropSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    cropSortKey.value = key
    cropSortOrder.value = 'desc'
  }
}

// 進入 crop 分頁時自動載入年份與資料
watch(activeTab, (tab) => {
  if (tab === 'crop') {
    fetchCropYears()
  }
})
// 切換鄉鎮時自動載入年份與資料
watch(selectedCropTown, () => {
  fetchCropYears()
})
// fetchCropYears 結束後自動呼叫 fetchCropData
async function fetchCropYears() {
  try {
    // 預設用 year=111 查詢
    const res = await fetch(`https://map.soezsell.com/api_cropData.php?year=111&town=${encodeURIComponent(selectedCropTown.value)}`)
    const data = await res.json()
    console.log('fetchCropYears data:', data)
    if (!Array.isArray(data) || data.length === 0) {
      cropYearList.value = []
      selectedCropYear.value = ''
      cropData.value = []
      return
    }
    const years = Array.from(new Set(data.map(item => String(item.year)))).sort((a, b) => b - a)
    cropYearList.value = years
    if (!years.includes(selectedCropYear.value)) {
      selectedCropYear.value = years[0] || ''
    }
    await fetchCropData()
  } catch (e) {
    cropYearList.value = []
    selectedCropYear.value = ''
    cropData.value = []
    console.log('fetchCropYears error', e)
  }
}
async function fetchCropData() {
  if (!selectedCropYear.value) {
    cropData.value = []
    return
  }
  try {
    const res = await fetch(`https://map.soezsell.com/api_cropData.php?year=${selectedCropYear.value}&town=${encodeURIComponent(selectedCropTown.value)}`)
    const data = await res.json()
    cropData.value = data
    console.log('fetchCropData', selectedCropYear.value, selectedCropTown.value, data)
  } catch (e) {
    cropData.value = []
    console.log('fetchCropData error', e)
  }
}

// 預設載入一次
onMounted(async () => {
  // 發電量資料
  try {
    const response = await fetch('https://soezsell.com/test-map/info.php?state_stats=%E9%9B%B2%E6%9E%97%E7%B8%A3')
    const data = await response.json()
    // 按照鄉鎮市和狀態排序
    townData.value = data.sort((a, b) => {
      if (a.Town === b.Town) {
        // 如果鄉鎮市相同，按照狀態排序
        const stateOrder = { '已併聯': 1, '施工中': 2, '申請中': 3 }
        return stateOrder[a.State] - stateOrder[b.State]
      }
      // 先按鄉鎮市排序
      return a.Town.localeCompare(b.Town, 'zh-TW')
    })
  } catch (error) {
    console.error('無法獲取鄉鎮資料:', error)
  }
  // 稅收資料動態抓取最新年份
  try {
    const latestRes = await fetch('https://map.soezsell.com/Get_tax_data.php?year=110')
    const latestJson = await latestRes.json()
    let maxYear = 101
    if (latestJson && latestJson.length > 0) {
      maxYear = Math.max(...latestJson.map(i => parseInt(i.year) || 0), 101)
    }
    const now = new Date()
    const years = []
    for (let y = 101; y <= maxYear; y++) {
      years.push(y)
    }
    yearList.value = years.reverse()
    selectedTaxYear.value = yearList.value[0]
    await fetchTaxData()
  } catch (error) {
    console.error('無法偵測稅收最新年份:', error)
  }
  await fetchCropData()
})
</script>

<style scoped>
.table-download-container {
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 30px 20px 20px 20px;
}
h2 {
  color: #038686;
  text-align: center;
  margin-bottom: 20px;
}
.tab-bar {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}
.tab-bar button {
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  font-size: 1.1em;
}
.tab-bar button::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #038686;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.tab-bar button:hover {
  color: #038686;
}
.tab-bar button.active {
  color: #038686;
  font-weight: bold;
}
.tab-bar button.active::after {
  transform: scaleX(1);
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
}
.filter-download-btn {
  margin-left: auto;
}
.state-filter {
  margin-bottom: 15px;
}
.tax-filter {
  margin-bottom: 15px;
}
.tax-filter select, .state-filter button {
  margin-right: 10px;
}
.download-btn, .state-filter button {
  background: #038686;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-size: 1em;
  box-shadow: 0 2px 8px rgba(3, 134, 134, 0.12);
}
.download-btn:hover, .state-filter button:hover {
  background: #026d6d;
}
.state-filter button.active {
  background: #fff;
  color: #038686;
  border: 2px solid #038686;
}
.data-table th.sorted {
  background: #026d6d;
  color: #fff;
}
.data-table th {
  cursor: pointer;
  user-select: none;
  position: relative;
}
.tax-sum-row {
  background: #e0f7fa;
  font-weight: bold;
}
.power-sum-row {
  background: #e0f7fa;
  font-weight: bold;
}
.crop-sum-row {
  background: #e0f7fa;
  font-weight: bold;
}
.table-scroll {
  overflow-x: auto;
}
.table-scroll .data-table {
  min-width: 1200px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}
.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.data-table th {
  background-color: #038686;
  color: white;
  font-weight: 600;
}
.data-table tr:hover {
  background-color: #f5f5f5;
}
.data-table td {
  color: #333;
}
.data-table tr:last-child td {
  border-bottom: none;
}
.table-section-with-download {
  position: relative;
}
</style> 