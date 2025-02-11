import { gql, request } from "graphql-request";

const url =
  "https://api.studio.thegraph.com/query/90479/defi-analysis/version/latest";

const SEARCH_QUERY = gql`
  query getUser($search: String!, $first: Int!, $skip: Int!) {
    user(id: $search) {
      id
      totalBorrowed
      totalLiquidated
      totalRepaid
      totalSupplied
      totalWithdrawn
      flashLoanCount
      transactions(orderDirection: asc, first: $first, skip: $skip) {
        id
        amount
        eventType
        reserve
        timestamp
        transactionHash
      }
    }
  }
`;

const DAILY_STATS_SEARCH_QUERY = gql`
  query getUserDailyStats($search: String!) {
    dailyStats_collection(
      interval: day
      where: {user: $search}
    ) {
      id
      timestamp
      totalSupplied
      totalBorrowed
      totalWithdrawn
    }
  }
`

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
  transactions: UserTransaction[];
}

export interface SearchResults {
  user: User | null;
}

export interface DailyStats {
  id: string,
  timestamp: string,
  totalSupplied: string,
  totalBorrowed: string,
  totalWithdrawn: string
}

export interface DailyStatsSearchResults {
  dailyStats_collection: DailyStats[]
}

export async function fetchData(
  searchQuery: string,
  first: number = 10,
  skip: number = 0
): Promise<SearchResults | null> {
  if (!searchQuery) return null; // Prevent unnecessary fetches
  return await request(url, SEARCH_QUERY, { search: searchQuery, first, skip });
}

export async function fetchDailyStats(
  userAddress: string
): Promise<DailyStatsSearchResults | null> {
  if (!userAddress) return null;
  return await request(url, DAILY_STATS_SEARCH_QUERY, { search: userAddress} );
}
