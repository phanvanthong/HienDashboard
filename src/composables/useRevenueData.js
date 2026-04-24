import { computed } from 'vue'
import rawData from '../data/revenue.json'

export const LOAI_HINH = ['DH', 'KH', 'Kids', 'Debate', 'NK', 'Công nghệ', 'Camp', 'Commission']

export const LOAI_LABEL = {
  DH: 'Du học',
  KH: 'Khoá học',
  Kids: 'Kids',
  Debate: 'Debate',
  NK: 'Ngoại khoá',
  'Công nghệ': 'Công nghệ',
  Camp: 'Trại hè',
  Commission: 'Commission',
}

export const LOAI_COLORS = {
  DH: '#0071e3',
  KH: '#34c759',
  Kids: '#ff9500',
  Debate: '#af52de',
  NK: '#ff6b6b',
  'Công nghệ': '#5ac8fa',
  Camp: '#ffcc02',
  Commission: '#8e8e93',
}

export function normalizeLoai(loai) {
  if (!loai) return null
  if (loai === 'Kite') return 'Công nghệ'
  if (!LOAI_HINH.includes(loai)) return null
  return loai
}

// Returns reactive filtered dataset based on from/to month refs ("YYYY-MM")
export function useRevenueData(fromRef, toRef) {
  const filtered = computed(() => {
    const from = fromRef.value
    const to = toRef.value
    if (!from || !to) return rawData

    const [fy, fm] = from.split('-').map(Number)
    const [ty, tm] = to.split('-').map(Number)

    return rawData.filter((r) => {
      if (!r.thang) return false
      const ym = (r.nam || 2024) * 12 + r.thang
      return ym >= fy * 12 + fm && ym <= ty * 12 + tm
    })
  })

  // Aggregate: sum of two money columns by normalized loại hình
  const totalRevenue = computed(() => {
    const map = Object.fromEntries(LOAI_HINH.map((l) => [l, { quaTang: 0, dtSauQua: 0 }]))
    filtered.value.forEach((r) => {
      const l = normalizeLoai(r.loaiHinh)
      if (!l) return
      map[l].quaTang += r.quaTang || 0
      map[l].dtSauQua += r.dtSauQua || 0
    })
    return map
  })

  // Aggregate by phanLoai (Đăng ký mới / Hoàn thiện) × loại hình
  const revByCategory = computed(() => {
    const TYPES = ['Đăng ký mới', 'Hoàn thiện']
    const map = {}
    LOAI_HINH.forEach((l) => {
      map[l] = { 'Đăng ký mới': 0, 'Hoàn thiện': 0, count_dkm: 0, count_ht: 0 }
    })
    filtered.value.forEach((r) => {
      const l = normalizeLoai(r.loaiHinh)
      if (!l || !TYPES.includes(r.phanLoai)) return
      map[l][r.phanLoai] += r.dtThucTe || 0
      if (r.phanLoai === 'Đăng ký mới') map[l].count_dkm++
      else if (r.phanLoai === 'Hoàn thiện') map[l].count_ht++
    })
    return map
  })

  // Revenue by team or CN
  const revByTeam = computed(() => {
    const map = {}
    filtered.value.forEach((r) => {
      const key = r.team || 'N/A'
      map[key] = (map[key] || 0) + (r.dtSauQua || 0)
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  })

  const revByCN = computed(() => {
    const map = {}
    filtered.value.forEach((r) => {
      const key = r.cn || 'N/A'
      map[key] = (map[key] || 0) + (r.dtSauQua || 0)
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  })

  // Sale ranking
  const saleRanking = computed(() => {
    const map = {}
    filtered.value.forEach((r) => {
      if (!r.sale) return
      const key = r.maNV || r.sale
      if (!map[key]) map[key] = { maNV: r.maNV || '', sale: r.sale, total: 0, dh: 0, daotao: 0, ngoaikhoa: 0, khac: 0 }
      const l = normalizeLoai(r.loaiHinh)
      const dt = r.dtSauQua || 0
      map[key].total += dt
      const isDH       = l === 'DH'
      const isDaoTao   = ['KH', 'Kids', 'Debate'].includes(l)
      const isNgoai    = ['NK', 'Công nghệ'].includes(l) // Kite đã normalize → Công nghệ
      if (isDH)     map[key].dh       += dt
      if (isDaoTao) map[key].daotao   += dt
      if (isNgoai)  map[key].ngoaikhoa += dt
      if (!isDH && !isDaoTao && !isNgoai) map[key].khac += dt
    })
    return Object.values(map).sort((a, b) => b.total - a.total)
  })

  // Revenue by data source
  const revBySource = computed(() => {
    const map = {}
    filtered.value.forEach((r) => {
      const key = r.nguon || 'Khác'
      map[key] = (map[key] || 0) + (r.dtThucTe || 0)
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  })

  // Per-sale: DT ratio + order count ratio (for Tab2 analysis table)
  const saleAnalysis = computed(() => {
    const map = {}
    filtered.value.forEach((r) => {
      if (!r.sale) return
      const l = normalizeLoai(r.loaiHinh)
      if (!l) return
      const key = r.maNV || r.sale
      if (!map[key]) map[key] = { maNV: r.maNV || '', sale: r.sale, totalDT: 0, totalDon: 0 }
      map[key].totalDT += r.dtSauQua || 0
      map[key].totalDon++
    })
    const rows = Object.values(map).sort((a, b) => b.totalDT - a.totalDT)
    const grandDT  = rows.reduce((s, r) => s + r.totalDT,  0)
    const grandDon = rows.reduce((s, r) => s + r.totalDon, 0)
    return rows.map((r) => ({
      ...r,
      pctDT:    grandDT  > 0 ? (r.totalDT  / grandDT)  * 100 : 0,
      pctDon:   grandDon > 0 ? (r.totalDon / grandDon) * 100 : 0,
      dtPerDon: r.totalDon > 0 ? r.totalDT / r.totalDon : 0,
    }))
  })

  // Unique active sales count per month (for Tab2 trend chart)
  const activeSalesByMonth = computed(() => {
    const monthMap = {}
    filtered.value.forEach((r) => {
      if (!r.sale || !r.thang) return
      const key = `${r.nam || 2024}-${String(r.thang).padStart(2, '0')}`
      if (!monthMap[key]) monthMap[key] = new Set()
      monthMap[key].add(r.sale)
    })
    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, sales]) => ({ month, count: sales.size }))
  })

  return { filtered, totalRevenue, revByCategory, revByTeam, revByCN, saleRanking, revBySource, saleAnalysis, activeSalesByMonth }
}
