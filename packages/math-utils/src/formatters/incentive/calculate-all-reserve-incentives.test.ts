import { calculateAllReserveIncentives } from './calculate-all-reserve-incentives';
import {
  reserveIncentives,
  allIncentivesReservesWithRewardReserve,
  allIncentivesReserves,
  aETHReserveIncentiveData,
} from './incentive.mocks';

describe('calculateAllReserveIncentives', () => {
  it('calculates correct incentives data for each reserve asset', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives,
      reserves: allIncentivesReservesWithRewardReserve,
    });
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].lIncentives
        .incentiveAPR,
    ).toBe('0.00244612257400076464');
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].vdIncentives
        .incentiveAPR,
    ).toBe('0.00315794307743075208');
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].sdIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].lIncentives
        .incentiveAPR,
    ).toBe('0.04137490906677563954');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].vdIncentives
        .incentiveAPR,
    ).toBe('0.04740458788219602162');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].sdIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].lIncentives
        .incentiveAPR,
    ).toBe('0.00957231039837386774');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].vdIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].sdIncentives
        .incentiveAPR,
    ).toBe('0');
  });

  it('calculates correct incentives with priceFeed from incentives data', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives,
      reserves: allIncentivesReserves,
    });
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].lIncentives
        .incentiveAPR,
    ).toBe('0.00244612257400076464');
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].vdIncentives
        .incentiveAPR,
    ).toBe('0.00315794307743075208');
    expect(
      result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'].sdIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].lIncentives
        .incentiveAPR,
    ).toBe('0.04137490906677563954');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].vdIncentives
        .incentiveAPR,
    ).toBe('0.04740458788219602162');
    expect(
      result['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'].sdIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].lIncentives
        .incentiveAPR,
    ).toBe('0.00957231039837386774');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].vdIncentives
        .incentiveAPR,
    ).toBe('0');
    expect(
      result['0x8798249c2e607446efb7ad49ec89dd1865ff4272'].sdIncentives
        .incentiveAPR,
    ).toBe('0');
  });

  it('not add reserveIncentivesDict entry if no reserve is found', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives,
      reserves: [],
    });
    expect(result['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2']).toBe(
      undefined,
    );
  });
  it('use the underlyingAsset price if reward token has an underlyingAsset', () => {
    const result = calculateAllReserveIncentives({
      reserveIncentives: [
        {
          ...aETHReserveIncentiveData,
          lIncentiveData: {
            ...aETHReserveIncentiveData.lIncentiveData,
            priceFeed: '0',
          },
          vdIncentiveData: {
            ...aETHReserveIncentiveData.vdIncentiveData,
            priceFeed: '0',
          },
          sdIncentiveData: {
            ...aETHReserveIncentiveData.sdIncentiveData,
            priceFeed: '0',
          },
        },
      ],
      reserves: allIncentivesReservesWithRewardReserve,
      underlyingAsserDict: {
        '0x4da27a545c0c5b758a6ba100e3a049001de870f5':
          '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      },
    });
    expect(
      result[aETHReserveIncentiveData.underlyingAsset].lIncentives.incentiveAPR,
    ).not.toBe('0');
    expect(
      result[aETHReserveIncentiveData.underlyingAsset].vdIncentives
        .incentiveAPR,
    ).not.toBe('0');
    // because emissionPerSecond === '0'
    expect(
      result[aETHReserveIncentiveData.underlyingAsset].sdIncentives
        .incentiveAPR,
    ).toBe('0');
  });
});
