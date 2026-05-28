import { type ErrorLike } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { type GraphQLFormattedError } from 'graphql';

const UNAUTHENTICATED_GRAPHQL_MESSAGES = new Set([
  'Unauthorized',
  'Token has expired.',
  'Token invalid.',
]);

let authSessionTerminated = false;
let lastSuccessfulTokenRenewalAt: number | null = null;

export const RECENT_TOKEN_RENEWAL_WINDOW_MS = 5000;

export const markAuthSessionTerminated = () => {
  authSessionTerminated = true;
};

export const resetAuthSessionTerminated = () => {
  authSessionTerminated = false;
};

export const isAuthSessionTerminated = () => authSessionTerminated;

export const markTokenRenewalSucceeded = () => {
  lastSuccessfulTokenRenewalAt = Date.now();
};

export const clearTokenRenewalSucceeded = () => {
  lastSuccessfulTokenRenewalAt = null;
};

export const hasRecentTokenRenewal = () => {
  if (lastSuccessfulTokenRenewalAt === null) {
    return false;
  }

  return (
    Date.now() - lastSuccessfulTokenRenewalAt <
    RECENT_TOKEN_RENEWAL_WINDOW_MS
  );
};

export const isUnauthenticatedGraphQLError = (
  graphQLError: GraphQLFormattedError,
): boolean => {
  if (graphQLError.extensions?.code === 'UNAUTHENTICATED') {
    return true;
  }

  return UNAUTHENTICATED_GRAPHQL_MESSAGES.has(graphQLError.message);
};

export const isUnauthenticatedApolloError = (error: ErrorLike): boolean => {
  if (!CombinedGraphQLErrors.is(error)) {
    return false;
  }

  return error.errors.some(isUnauthenticatedGraphQLError);
};
