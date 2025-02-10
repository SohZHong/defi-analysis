import { gql, request } from "graphql-request";

const url = "https://api.studio.thegraph.com/query/90479/defi-analysis/version/latest";

const SEARCH_QUERY = gql`
  query getUser($search: String!) {
    user(id: $search) {
      id
      totalBorrowed
      totalLiquidated
      totalRepaid
      totalSupplied
      totalWithdrawn
      flashLoanCount
    }
  }
`;

interface User {
  id: string,
  totalSupplied: string,
  totalBorrowed: string,
  totalRepaid: string
}

interface SearchResults {
  user: User | null
}

export async function fetchData(searchQuery: string): Promise<SearchResults | null> {
  if (!searchQuery) return null; // Prevent unnecessary fetches
  return await request(url, SEARCH_QUERY, { search: searchQuery });
}