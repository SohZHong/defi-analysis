import { DailyStatsSearchResults, User, UserTransaction } from '@/common/types';
import { gql, request } from 'graphql-request';

const url =
  'https://api.studio.thegraph.com/query/90479/defi-analysis/version/latest';

const USER_SEARCH_QUERY = gql`
  query getUser($search: String!) {
    user(id: $search) {
      id
      aave {
        totalTransactions
        totalBorrowed
        totalLiquidated
        totalRepaid
        totalSupplied
        totalWithdrawn
        useReserveAsCollateral
        id
      }
      compound {
        totalTransactions
        totalBorrowed
        totalLiquidated
        totalRepaid
        totalSupplied
        totalWithdrawn
        id
      }
      silo {
        id
        totalBorrowed
        totalLiquidated
        totalRepaid
        totalSupplied
        totalTransactions
        totalWithdrawn
      }
    }
  }
`;

const USER_TRANSACTION_SEARCH_QUERY = gql`
  query getUserTransaction(
    $search: String!
    $protocol: ProtocolType!
    $first: Int!
    $skip: Int!
  ) {
    baseTransactions(
      where: { user: $search, protocol: $protocol }
      first: $first
      skip: $skip
    ) {
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
  query getUserDailyStats($search: String!, $protocol: ProtocolType!) {
    dailyBorrowStats_collection(
      interval: day
      where: { user: $search, protocol: $protocol }
    ) {
      timestamp
      total
      id
    }
    dailyLiquidationStats_collection(
      interval: day
      where: { user: $search, protocol: $protocol }
    ) {
      timestamp
      total
      id
    }
    dailyRepayStats_collection(
      interval: day
      where: { user: $search, protocol: $protocol }
    ) {
      timestamp
      total
      id
    }
    dailySupplyStats_collection(
      interval: day
      where: { user: $search, protocol: $protocol }
    ) {
      timestamp
      total
      id
    }
    dailyWithdrawStats_collection(
      interval: day
      where: { user: $search, protocol: $protocol }
    ) {
      timestamp
      total
      id
    }
  }
`;

export interface TransactionSearchResults {
  baseTransactions: UserTransaction[];
}

export interface UserSearchResults {
  user: User;
}

export async function fetchUserData(
  searchQuery: string
): Promise<UserSearchResults> {
  try {
    const response: UserSearchResults = await request(url, USER_SEARCH_QUERY, {
      search: searchQuery,
    });

    if (!response || !response.user) {
      console.error('fetchUserData: No user found in response!', response);
      throw new Error('User not found');
    }

    return response;
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    throw error;
  }
}

export async function fetchTransactionData(
  searchQuery: string,
  protocol: string,
  first: number = 50,
  skip: number = 0
): Promise<TransactionSearchResults> {
  try {
    const response: TransactionSearchResults = await request(
      url,
      USER_TRANSACTION_SEARCH_QUERY,
      {
        search: searchQuery,
        protocol,
        first,
        skip,
      }
    );
    // 0x06777d71071b5f8faa90dac3b7683c4696d73958
    if (response.baseTransactions.length === 0) {
      throw new Error('No data for the user is found');
    }
    return response;
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    throw error;
  }
}

export async function fetchDailyStats(
  searchQuery: string,
  protocol: string
): Promise<DailyStatsSearchResults> {
  try {
    const response: DailyStatsSearchResults = await request(
      url,
      DAILY_STATS_SEARCH_QUERY,
      {
        search: searchQuery,
        protocol,
      }
    );

    return response;
  } catch (error) {
    console.error('GraphQL Request Error:', error); // Catch errors
    throw error;
  }
}
