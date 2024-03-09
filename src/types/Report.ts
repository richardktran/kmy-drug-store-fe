export interface Revenue {
  from: string
  to: string
  total: number
}

export interface RevenueReport {
  current: Revenue | null
  previous: Revenue | null
  percentage_change: number
}

export interface RevenueReportSummary {
  day_revenue: RevenueReport
  month_revenue: RevenueReport
  year_revenue: RevenueReport
  total_revenue: RevenueReport
}
