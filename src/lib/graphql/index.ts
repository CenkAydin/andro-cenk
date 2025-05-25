import { StrictTypedTypePolicies, TypedFieldPolicy } from "@andromedaprotocol/gql";
import { ApolloClient, InMemoryCache, from, HttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

/**
 * Apollo client used for queries, may require some state usage later
 */
export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  defaultOptions: {
    query: {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-first',
      errorPolicy: 'all'
    },
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  },
  ssrMode: true,
  ssrForceFetchDelay: 500,
  cache: new InMemoryCache({
    typePolicies: {
      ...TypedFieldPolicy,
      ChainConfig: {
        keyFields: ['chainId']
      },
      ChainConfigQuery: {
        merge: true
      },
      AccountsQuery: {
        fields: {
          assets: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: ['walletAddress'],

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing, incoming, { args }) {
              const offset = args?.offset ?? 0;
              console.log(args?.offset, "ARGS", incoming, existing)
              // Slicing is necessary because the existing data is
              // immutable, and frozen in development.
              const merged = existing ? existing.slice(0, offset) : [];
              merged.push(...incoming)
              return merged;
            },
          }
        }
      },
      AssetResult: {
        keyFields: ['address', 'name', 'chainId']
      },
      NftInfo: {
        keyFields: ['tokenId']
      }
    } as StrictTypedTypePolicies
  }),
});
