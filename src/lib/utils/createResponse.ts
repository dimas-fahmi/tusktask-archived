import { NextResponse } from "next/server";

/**
 * A standardized API response structure.
 *
 * @template T - The type of the `result` field (e.g., an object, array, or null).
 */
export interface StandardizeResponse<T> {
  /** HTTP status code (e.g., 200, 400, 500) */
  status: number;
  /** Application-specific response code (e.g., "success", "bad_request") */
  code: string;
  /** Human-readable description of the response */
  message: string;
  /** The actual result data returned by the API */
  result: T;
  /** Optional flag to enable logging the response to the console */
  log?: boolean;
  /** Optional identifier for the API path, used in logging (e.g., "API_USERS_GET") */
  path?: string;
}

/**
 * Creates a standardized JSON response using Next.js `NextResponse`.
 *
 * @template T - The type of the response `result` payload.
 *
 * @param {number} status - HTTP status code to return.
 * @param {string} code - Application-specific code (e.g., "success", "bad_request").
 * @param {string} message - A human-readable message about the result.
 * @param {T} result - The actual data to return in the response.
 * @param {boolean} [log=false] - Whether to log the response to the console.
 * @param {string} [path] - Optional identifier for logging (e.g., "API_USERS_GET").
 *
 * @returns {ReturnType<typeof NextResponse.json<StandardizeResponse<T>>>}
 * A Next.js JSON response with a standardized format.
 *
 * @example
 * ```ts
 * createResponse<T>(200, "success", "Fetched data", [{ id: 1 }]);
 * ```
 */
export const createResponse = <T>(
  status: number,
  code: string,
  message: string,
  result: T,
  log = false,
  path?: string,
): ReturnType<typeof NextResponse.json<StandardizeResponse<T>>> => {
  const response: StandardizeResponse<T> = { status, code, message, result };

  if (log && path) {
    console.log(path, response);
  }

  return NextResponse.json(response, { status });
};
