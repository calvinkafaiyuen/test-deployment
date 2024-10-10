export function generateLikeClause(searchColumns: string[], startIndex: number = 1): string {
  return searchColumns.map((col, idx) => `CAST(${col} AS TEXT) ILIKE $${idx + startIndex}`).join(' OR ');
}

export function generateParameters(searchColumns: string[], searchQuery: string): string[] {
  return searchColumns.map(() => `%${searchQuery}%`);
}