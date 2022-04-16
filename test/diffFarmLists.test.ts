import { diffFarmLists, FarmInfo } from '../src';

const farmA: FarmInfo = {
  id: 1,
  pair: '0xf4003F4efBE8691B60249E6afbD307aBE7758adb',
  allocPoint: 5000,
  masterChef: '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F',
  name: 'AVAX-USDC',
};
const farmAChangedNameAllocPoint: FarmInfo = {
  ...farmA,
  name: 'blah',
  allocPoint: 0,
};

const farmB: FarmInfo = {
  id: 2,
  pair: '0xb2303G4efCE8691B60249E6afbD307aBE7758adb',
  allocPoint: 5000,
  masterChef: '0x4483f0b6e2F5486D06958C20f8C39A7aBe87bf8F',
  name: 'AVAX-USDC',
  token0: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  token1: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
};

describe('#diffFarmLists', () => {
  it('change id', () => {
    expect(diffFarmLists([farmA], [farmB])).toEqual({
      added: [farmB],
      removed: [farmA],
      changed: {},
    });
  });

  it('change allocPoint', () => {
    expect(
      diffFarmLists([farmB, farmA], [farmB, farmAChangedNameAllocPoint])
    ).toEqual({
      added: [],
      removed: [],
      changed: {
        1: {
          '0xf4003F4efBE8691B60249E6afbD307aBE7758adb': ['allocPoint', 'name'],
        },
      },
    });
  });
});
