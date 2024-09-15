export interface RouteQuery {
  query: string;
  route: string;
}

export interface HistoryState {
  queries: RouteQuery[];
}
