import { gql, request } from 'graphql-request';

const url = 'https://api.studio.thegraph.com/query/90479/defi-analysis/v0.0.2';

const USER_SEARCH_QUERY = gql`
  query getUser($search: String!) {
    user(id: $search) {
      id
      flashLoanCount
      totalBorrowed
      totalLiquidated
      totalRepaid
      totalSupplied
      totalWithdrawn
      useReserveAsCollateral
    }
  }
`;

const USER_TRANSACTION_SEARCH_QUERY = gql`
  query getUserTransaction($search: String!, $first: Int!, $skip: Int!) {
    baseTransactions(where: { user: $search }, first: $first, skip: $skip) {
      amount
      blockNumber
      eventType
      id
      reserve
      timestamp
      transactionHash
    }
  }
`;

const DAILY_STATS_SEARCH_QUERY = gql`
  query getUserDailyStats($search: String!) {
    dailyBorrowStats_collection(interval: day, where: { user: $search }) {
      timestamp
      total
      id
    }
    dailyLiquidationStats_collection(interval: day, where: { user: $search }) {
      timestamp
      total
      id
    }
    dailyRepayStats_collection(interval: day, where: { user: $search }) {
      timestamp
      total
      id
    }
    dailySupplyStats_collection(interval: day, where: { user: $search }) {
      timestamp
      total
      id
    }
    dailyWithdrawStats_collection(interval: day, where: { user: $search }) {
      timestamp
      total
      id
    }
  }
`;

export interface UserTransaction {
  id: string;
  amount: string;
  eventType: string;
  reserve: string;
  timestamp: string;
  transactionHash: string;
}

export interface User {
  id: string;
  totalSupplied: string;
  totalBorrowed: string;
  totalRepaid: string;
  totalLiquidated: string;
  totalWithdrawn: string;
  flashLoanCount: number;
}

export interface TransactionSearchResults {
  baseTransactions: UserTransaction[];
}

export interface UserSearchResults {
  user: User | null;
}

export interface DailyStats {
  id: string;
  total: string;
  timestamp: string;
}

export interface DailyStatsSearchResults {
  dailyBorrowStats_collection: DailyStats[];
  dailyLiquidationStats_collection: DailyStats[];
  dailyRepayStats_collection: DailyStats[];
  dailySupplyStats_collection: DailyStats[];
  dailyWithdrawStats_collection: DailyStats[];
}

export async function fetchUserData(
  searchQuery: string
): Promise<UserSearchResults | null> {
  if (!searchQuery) {
    console.warn('fetchUserData: searchQuery is empty, returning null');
    return null;
  }

  try {
    console.log(`Fetching user data for: ${searchQuery}`);

    const response: UserSearchResults = await request(url, USER_SEARCH_QUERY, {
      search: searchQuery,
    });

    console.log('GraphQL Response:', response);

    if (!response || !response.user) {
      console.error('fetchUserData: No user found in response!', response);
      return null;
    }

    return response;
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    return null;
  }
}

export async function fetchTransactionData(
  searchQuery: string,
  first: number = 50,
  skip: number = 0
): Promise<TransactionSearchResults | null> {
  if (!searchQuery) {
    console.warn('fetchTransactionData: searchQuery is empty, returning null');
    return null;
  }

  try {
    console.log(`Fetching transaction data for: ${searchQuery}`);
    const response: TransactionSearchResults = await request(
      url,
      USER_TRANSACTION_SEARCH_QUERY,
      {
        search: searchQuery,
        first,
        skip,
      }
    );
    console.log('GraphQL Response:', response);
    if (response.baseTransactions.length === 0) {
      console.error(
        'fetchTransactionData: No transactions found in response!',
        response
      );
      return null;
    }
    return response;
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    return null;
  }
}

export async function fetchDailyStats(
  searchQuery: string
): Promise<DailyStatsSearchResults | null> {
  if (!searchQuery) return null;
  try {
    const response: DailyStatsSearchResults = await request(
      url,
      DAILY_STATS_SEARCH_QUERY,
      {
        search: searchQuery,
      }
    );
    console.log('GraphQL Response:', response); // Debugging log

    return response; // Ensure returning the correct data format
  } catch (error) {
    console.error('GraphQL Request Error:', error); // Catch errors
    return null; // Return null on failure
  }
}
