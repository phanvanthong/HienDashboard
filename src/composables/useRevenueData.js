import { computed } from 'vue'
import { revenueData } from '../store/dataStore.js'

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
    if (!from || !to) return revenueData.value

    const [fy, fm] = from.split('-').map(Number)
    const [ty, tm] = to.split('-').map(Number)

    return revenueData.value.filter((r) => {
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

  // Aggregate by phanLoai × loại hình
  // Revenue (dtThucTe) groups by 'Phân loại học sinh' (phanLoaiHS)
  // Order counts group by 'Phân loại học sinh chuẩn' (phanLoai)
  const revByCategory = computed(() => {
    const TYPES = ['Đăng ký mới', 'Hoàn thiện']
    const map = {}
    LOAI_HINH.forEach((l) => {
      map[l] = { 'Đăng ký mới': 0, 'Hoàn thiện': 0, count_dkm: 0, count_ht: 0 }
    })
    filtered.value.forEach((r) => {
      const l = normalizeLoai(r.loaiHinh)
      if (!l) return
      if (TYPES.includes(r.phanLoaiHS)) map[l][r.phanLoaiHS] += r.dtThucTe || 0
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

  // dtThucTe by CN (for Doanh thu theo chi nhánh donut)
  const revByCNDtThucTe = computed(() => {
    const map = {}
    filtered.value.forEach((r) => {
      const key = r.cn || 'N/A'
      map[key] = (map[key] || 0) + (r.dtThucTe || 0)
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  })

  // Total dtThucTe across all records
  const totalDtThucTe = computed(() =>
    filtered.value.reduce((s, r) => s + (r.dtThucTe || 0), 0)
  )

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

  // SAT / IELTS order counts (loaiHinh=KH, chiTietMonHoc=SAT|IELTS, grouped by phanLoai)
  const satIeltsOrders = computed(() => {
    const result = {
      SAT:   { dkm: 0, ht: 0 },
      IELTS: { dkm: 0, ht: 0 },
    }
    filtered.value.forEach((r) => {
      if (r.loaiHinh !== 'KH') return
      const mon = r.chiTietMonHoc
      if (mon !== 'SAT' && mon !== 'IELTS') return
      if (r.phanLoai === 'Đăng ký mới') result[mon].dkm++
      else if (r.phanLoai === 'Hoàn thiện') result[mon].ht++
    })
    return result
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

  // byMonth: aggregate per calendar month for Tab2 monthly charts
  const byMonth = computed(() => {
    const from = fromRef.value
    const to   = toRef.value
    if (!from || !to) return []

    // Compute top5 teams and top5 CN over entire filtered dataset
    const teamTotals = {}
    const cnTotals = {}
    filtered.value.forEach((r) => {
      const t = r.team || 'N/A'
      teamTotals[t] = (teamTotals[t] || 0) + (r.dtSauQua || 0)
      const c = r.cn || 'N/A'
      cnTotals[c] = (cnTotals[c] || 0) + (r.dtSauQua || 0)
    })
    const top5Teams = new Set(
      Object.entries(teamTotals).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k)
    )
    const top5CN = new Set(
      Object.entries(cnTotals).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k)
    )
    const teamKeys = [...top5Teams, 'Khác']
    const cnKeys   = [...top5CN,   'Khác']

    // Generate ALL months in the filter range (even empty ones)
    const [fy, fm] = from.split('-').map(Number)
    const [ty, tm] = to.split('-').map(Number)
    const allMonths = []
    let y = fy, mo = fm
    while (y < ty || (y === ty && mo <= tm)) {
      const key = `${y}-${String(mo).padStart(2, '0')}`
      allMonths.push(key)
      mo++
      if (mo > 12) { mo = 1; y++ }
    }

    // Build empty buckets for every month in range
    const monthMap = {}
    allMonths.forEach((key) => {
      monthMap[key] = {
        month: key,
        dtSauQua: 0, quaTang: 0, dtThucTe: 0,
        donHang: 0, dkm: 0, ht: 0, donDkm: 0, donHt: 0,
        byLoai:      Object.fromEntries(LOAI_HINH.map((l) => [l, 0])),
        byLoaiCount: Object.fromEntries(LOAI_HINH.map((l) => [l, 0])),
        byTeam: Object.fromEntries(teamKeys.map((k) => [k, 0])),
        byCN:   Object.fromEntries(cnKeys.map((k) => [k, 0])),
        _sales: new Set(),
      }
    })

    // Fill in data
    filtered.value.forEach((r) => {
      if (!r.thang) return
      const key = `${r.nam || 2024}-${String(r.thang).padStart(2, '0')}`
      const m = monthMap[key]
      if (!m) return
      m.dtSauQua += r.dtSauQua || 0
      m.quaTang  += r.quaTang  || 0
      m.dtThucTe += r.dtThucTe || 0
      m.donHang  += 1
      if (r.phanLoaiHS === 'Đăng ký mới') m.dkm += r.dtThucTe || 0
      if (r.phanLoaiHS === 'Hoàn thiện')  m.ht  += r.dtThucTe || 0
      if (r.phanLoai  === 'Đăng ký mới') m.donDkm += 1
      if (r.phanLoai  === 'Hoàn thiện')  m.donHt  += 1

      const l = normalizeLoai(r.loaiHinh)
      if (l) { m.byLoai[l] += r.dtSauQua || 0; m.byLoaiCount[l] += 1 }

      const teamBucket = top5Teams.has(r.team || 'N/A') ? (r.team || 'N/A') : 'Khác'
      m.byTeam[teamBucket] += r.dtSauQua || 0

      const cnBucket = top5CN.has(r.cn || 'N/A') ? (r.cn || 'N/A') : 'Khác'
      m.byCN[cnBucket] += r.dtSauQua || 0

      if (r.sale) m._sales.add(r.sale)
    })

    return allMonths.map((key) => {
      const m = monthMap[key]
      const [yr, mon] = key.split('-').map(Number)
      const { _sales, ...rest } = m
      return { ...rest, label: `Th${mon}/${String(yr).slice(2)}`, activeSales: _sales.size }
    })
  })

  return { filtered, totalRevenue, totalDtThucTe, revByCategory, revByTeam, revByCN, revByCNDtThucTe, saleRanking, revBySource, satIeltsOrders, saleAnalysis, activeSalesByMonth, byMonth }
}
