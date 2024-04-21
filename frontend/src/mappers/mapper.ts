export interface Mapper<T> {
  (data: any): T;
}
