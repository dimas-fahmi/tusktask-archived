import type { StandardizedError } from "../errors";

export type LogType = "warn" | "info" | "error";

/**
 * Logs standardized errors with contextual path information and inferred log level.
 *
 * This function helps in logging meaningful and structured errors, especially
 * useful in API route handlers or service layers.
 *
 * @param path - A string representing where the error occurred. Follows the convention:
 * ```ts
 * "API_USERS_GET"
 * ```
 * Which translates to:
 * - `API`: API handler
 * - `USERS`: module or context
 * - `GET`: HTTP method or action
 *
 * @param error - A standardized error object that includes a mandatory `code` and `message`,
 * and optionally an HTTP `status`. If not provided, defaults to 500 (Internal Server Error).
 *
 * @param type - (Optional) Log level. If not provided:
 * - Defaults to `"error"` if no `status` is given.
 * - Otherwise, inferred from status:
 *   - 404 → "warn"
 *   - 401 → "info"
 *   - 403 → "warn"
 *   - 500 → "error"
 *   - 429 → "warn"
 *   - All other statuses → "error"
 *
 * @example
 * ```ts
 * createLog("API_USERS_GET", {
 *   code: "bad_request",
 *   message: "User not found",
 *   status: 404
 * });
 * ```
 *
 *  -> LOG:
 *
 * ```
 * "API_USERS_GET -> bad_request -> User not found", {
 *   code: "bad_request",
 *   message: "User not found",
 *   status: 404
 * }
 * ```
 *
 */
export const createLog = (
  path: string,
  error: StandardizedError,
  type?: LogType,
) => {
  const log = `${path} -> ${error?.code} -> ${error?.message}`;

  if (!type) {
    switch (error?.status) {
      case 404:
      case 403:
      case 429:
        type = "warn";
        break;
      case 401:
        type = "info";
        break;
      case 500:
        type = "error";
        break;
      case undefined:
      case null:
        type = "error";
        break;
      default:
        type = "error";
        break;
    }
  }

  switch (type) {
    case "warn":
      console.warn(log, error);
      break;
    case "info":
      console.info(log, error);
      break;
    case "error":
      console.error(log, error);
      break;
  }
};
