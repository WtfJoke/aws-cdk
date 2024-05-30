/**
 * These are custom parameter to be used when the target is an API Gateway REST API or EventBridge API destinations.
 */
export interface HttpParameters {
  /**
   * Additional headers sent to the API Destination or API Gateway
   *
   * These are merged with headers specified on the Connection, with
   * the headers on the Connection taking precedence.
   *
   * You can only specify secret values on the Connection.
   *
   * @default - none
   */
  readonly headers?: Record<string, string>;

  /**
   * Path parameters to insert in place of path wildcards (`*`).
   *
   * @default - none
   */
  readonly pathParameters?: [string];

  /**
   * Additional query string parameters sent to the API Destination or API Gateway
   *
   * @default - none
   */
  readonly queryParameters?: Record<string, string>;
}
