export interface FarmInfo {
  readonly id: number;
  readonly pair: string;
  readonly name: string;
  readonly allocPoint: number;
  readonly masterChef: string;
  readonly token0?: string;
  readonly token1?: string;
}

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export interface FarmList {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  readonly farms: FarmInfo[];
}
