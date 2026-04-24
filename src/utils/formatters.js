export const fmtVND = (n) => {
  if (!n || n === 0) return '0'
  n = Number(n)
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + ' tỷ'
  if (Math.abs(n) >= 1e6) return Math.round(n / 1e6) + ' tr'
  return new Intl.NumberFormat('vi-VN').format(n)
}

export const fmtShort = (n) => {
  if (!n || n === 0) return '0'
  n = Number(n)
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (Math.abs(n) >= 1e6) return Math.round(n / 1e6) + 'M'
  return new Intl.NumberFormat('vi-VN').format(n)
}

export const fmtFull = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0)
