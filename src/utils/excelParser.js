import * as XLSX from 'xlsx'

// Maps Excel column header → internal field, type, and which charts use it
export const COLUMN_DEFS = [
  {
    excel: 'Tháng ghi nhận doanh thu',
    field: 'thang',
    type: 'number',
    charts: ['Tất cả biểu đồ (lọc thời gian)'],
  },
  {
    excel: 'Năm ghi nhận doanh thu',
    field: 'nam',
    type: 'number',
    charts: ['Tất cả biểu đồ (lọc thời gian)'],
  },
  {
    excel: 'Loại hình',
    field: 'loaiHinh',
    type: 'string',
    charts: ['Tổng doanh thu', 'Tỷ lệ doanh thu', 'Doanh thu từng loại hình', 'Số đơn hàng từng loại hình', 'Doanh thu theo loại hình (Tab2)'],
  },
  {
    excel: 'Quà Tặng',
    field: 'quaTang',
    type: 'number',
    charts: ['Tổng doanh thu'],
  },
  {
    excel: 'Doanh thu sau quà tặng',
    field: 'dtSauQua',
    type: 'number',
    charts: ['Tổng doanh thu', 'Doanh thu từng team', 'Xếp hạng doanh số sale', 'Biến động doanh thu theo team (Tab2)'],
  },
  {
    excel: 'Doanh thu thực tế',
    field: 'dtThucTe',
    type: 'number',
    charts: ['Doanh thu từng loại hình dịch vụ', 'Doanh thu theo nguồn data'],
  },
  {
    excel: 'Phân loại học sinh',
    field: 'phanLoaiHS',
    type: 'string',
    charts: ['Doanh thu từng loại hình dịch vụ'],
  },
  {
    excel: 'Phân loại học sinh chuẩn',
    field: 'phanLoai',
    type: 'string',
    charts: ['Số đơn hàng từng loại hình', 'Số lượng đơn hàng (Tab2)'],
  },
  {
    excel: 'SALE',
    field: 'sale',
    type: 'string',
    charts: ['Xếp hạng doanh số sale', 'Biến động doanh thu theo team (Tab2)', 'Số sale hoạt động (Tab2)'],
  },
  {
    excel: 'Team',
    field: 'team',
    type: 'string',
    charts: ['Doanh thu từng team', 'Biến động doanh thu theo team (Tab2)'],
  },
  {
    excel: 'Mã NV',
    field: 'maNV',
    type: 'string',
    charts: ['Xếp hạng doanh số sale'],
    optional: true,
  },
  {
    excel: 'CN',
    field: 'cn',
    type: 'string',
    charts: ['Doanh thu từng chi nhánh'],
    optional: true,
  },
  {
    excel: 'Chi tiết môn học',
    field: 'chiTietMonHoc',
    type: 'string',
    charts: ['Số lượng đơn hàng SAT, IELTS'],
    optional: true,
  },
  {
    excel: 'Phân loại nguồn data',
    field: 'nguon',
    type: 'string',
    charts: ['Doanh thu theo nguồn data'],
    optional: true,
  },
]

export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rawRows = XLSX.utils.sheet_to_json(sheet, { raw: true, defval: null })

        if (rawRows.length === 0) {
          resolve({ success: false, empty: true })
          return
        }

        // Trim all header keys
        const firstRow = rawRows[0]
        const headers = Object.keys(firstRow).map(k => k.trim())

        // Check required columns
        const missing = COLUMN_DEFS.filter(def => !def.optional && !headers.includes(def.excel))
        if (missing.length > 0) {
          resolve({ success: false, missing })
          return
        }

        // Map rows to internal format
        const rows = rawRows.map(rawRow => {
          const trimmed = {}
          for (const [k, v] of Object.entries(rawRow)) trimmed[k.trim()] = v

          const record = {}
          for (const def of COLUMN_DEFS) {
            const val = trimmed[def.excel]
            if (def.type === 'number') {
              record[def.field] = val != null ? Number(val) || 0 : null
            } else {
              record[def.field] = val != null ? String(val).trim() || null : null
            }
          }
          return record
        }).filter(r => r.thang && r.nam)

        resolve({ success: true, rows, total: rows.length })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
