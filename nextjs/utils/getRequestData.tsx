import { gql, request } from "graphql-request";

const url =
  "https://api.studio.thegraph.com/query/90479/defi-analysis/version/v0.0.1";

const SEARCH_QUERY = gql`
  query getUser($search: String!, $first: Int!, $skip: Int!) {
    user(id: $search) {
      id
      flashLoanCount
      totalBorrowed
      totalLiquidated
      totalRepaid
      totalSupplied
      totalWithdrawn
      useReserveAsCollateral
      transactions(orderDirection: asc, first: $first, skip: $skip) {
        amount
        blockNumber
        eventType
        id
        reserve
        timestamp
        transactionHash
      }
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
  transactions: UserTransaction[];
}

export interface SearchResults {
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

export async function fetchData(
  searchQuery: string,
  first: number = 10,
  skip: number = 0
): Promise<SearchResults | null> {
  if (!searchQuery) {
    console.warn("fetchData: searchQuery is empty, returning null");
    return null;
  }

  try {
    console.log(`Fetching user data for: ${searchQuery}`);

    const response: SearchResults = await request(url, SEARCH_QUERY, {
      search: searchQuery,
      first,
      skip,
    });

    console.log("GraphQL Response:", response);

    if (!response || !response.user) {
      console.error("fetchData: No user found in response!", response);
      return null;
    }

    return response;
  } catch (error) {
    console.error("GraphQL Request Error:", error);
    return null;
  }
}

export async function fetchDailyStats(
  searchQuery: string
): Promise<DailyStatsSearchResults | null> {
  if (!searchQuery) return null;

  try {
    const response = await request(url, DAILY_STATS_SEARCH_QUERY, {
      search: searchQuery,
    });
    console.log(response);
    console.log("GraphQL Response:", response); // Debugging log

    return response as DailyStatsSearchResults; // Ensure you're returning the correct data format
  } catch (error) {
    console.error("GraphQL Request Error:", error); // Catch errors
    return null; // Return null on failure
  }
}
