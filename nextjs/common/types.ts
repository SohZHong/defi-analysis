export interface UserTransaction {
  id: string;
  amount: string;
  protocol: string;
  eventType: string;
  reserve: string;
  timestamp: string;
  blockNumber: string;
  transactionHash: string;
}

export interface AaveUser {
  id: string;
  totalTransactions: string;
  useReserveAsCollateral: boolean;
  totalSupplied: string;
  totalWithdrawn: string;
  totalRepaid: string;
  totalLiquidated: string;
  totalBorrowed: string;
}

export interface CompoundUser {
  id: string;
  totalTransactions: string;
  totalSupplied: string;
  totalWithdrawn: string;
  totalRepaid: string;
  totalLiquidated: string;
  totalBorrowed: string;
}

export interface SiloUser {
  id: string;
  totalBorrowed: string;
  totalLiquidated: string;
  totalRepaid: string;
  totalSupplied: string;
  totalTransactions: string;
  totalWithdrawn: string;
}

export interface User {
  id: string;
  aave: AaveUser;
  compound: CompoundUser;
  silo: SiloUser;
}

export interface DailyStats {
  id: string;
  total: string;
  protocol: string;
  timestamp: string;
}

export interface DailyStatsSearchResults {
  dailyBorrowStats_collection: DailyStats[];
  dailyLiquidationStats_collection: DailyStats[];
  dailyRepayStats_collection: DailyStats[];
  dailySupplyStats_collection: DailyStats[];
  dailyWithdrawStats_collection: DailyStats[];
}
