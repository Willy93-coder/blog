export type ActionResult<T = unknown> = { error: string | null, data?: T | null };
export type QueryResult<T> = { data: T; error: string | null };
