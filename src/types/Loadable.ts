export interface Loadable<T> {
  loading: boolean,
  data?: Array<T>,
  error?: Error
}
