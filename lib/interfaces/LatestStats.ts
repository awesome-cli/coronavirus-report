export interface RootObject {
  readonly confirmed: Confirmed;
  readonly recovered: Confirmed;
  readonly deaths: Confirmed;
  readonly lastUpdate: string;
}

interface Confirmed {
  readonly value: number;
  readonly detail: string;
}

export interface RootObject {
  readonly error: Error;
}

interface Error {
  readonly message: string;
}
