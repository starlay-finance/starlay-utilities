import { normalize } from '../../bignumber';
import {
  calculateUserReserveIncentives,
  CalculateUserReserveIncentivesRequest,
} from './calculate-user-reserve-incentives';
import {
  aETHReserveIncentiveData,
  aETHUserIncentiveData,
  aETHReserve,
  aUSDCReserveIncentiveData,
  aUSDCUserIncentiveData,
  aUSDCReserve,
  aXSUSHIReserveIncentiveData,
  aXSUSHIUserIncentiveData,
  aXSUSHIReserve,
} from './incentive.mocks';

describe('calculateUserReserveIncentives', () => {
  const userETHReserveIncentiveRequest: CalculateUserReserveIncentivesRequest =
    {
      reserveIncentives: aETHReserveIncentiveData,
      userReserveIncentives: aETHUserIncentiveData,
      userReserveData: aETHReserve,
      currentTimestamp: 1631587561,
    };

  const userUSDCReserveIncentiveRequest: CalculateUserReserveIncentivesRequest =
    {
      reserveIncentives: aUSDCReserveIncentiveData,
      userReserveIncentives: aUSDCUserIncentiveData,
      userReserveData: aUSDCReserve,
      currentTimestamp: 1631587561,
    };

  const userXSUSHIReserveIncentiveRequest: CalculateUserReserveIncentivesRequest =
    {
      reserveIncentives: aXSUSHIReserveIncentiveData,
      userReserveIncentives: aXSUSHIUserIncentiveData,
      userReserveData: aXSUSHIReserve,
      currentTimestamp: 1631587561,
    };

  it('should calculate the correct aWETH incentives', () => {
    const result = calculateUserReserveIncentives(
      userETHReserveIncentiveRequest,
    );
    const total = result.lIncentives
      .plus(result.vdIncentives)
      .plus(result.sdIncentives);
    expect(normalize(result.lIncentives, 18)).toBe('0.0024573771825653195');
    expect(normalize(result.vdIncentives, 18)).toBe('0');
    expect(normalize(result.sdIncentives, 18)).toBe('0');
    expect(normalize(total, 18)).toBe('0.0024573771825653195');
  });

  it('should calculate the correct aUSDC incentives', () => {
    const result = calculateUserReserveIncentives(
      userUSDCReserveIncentiveRequest,
    );
    const total = result.lIncentives
      .plus(result.vdIncentives)
      .plus(result.sdIncentives);
    expect(normalize(result.lIncentives, 18)).toBe('0.01782455862763241642');
    expect(normalize(result.vdIncentives, 18)).toBe('0.00103772579426512725');
    expect(result.sdIncentives.toFixed()).toBe('0');
    expect(normalize(total, 18)).toBe('0.01886228442189754366');
  });

  it('should calculate the correct xSushi incentives', () => {
    const result = calculateUserReserveIncentives(
      userXSUSHIReserveIncentiveRequest,
    );
    const total = result.lIncentives
      .plus(result.vdIncentives)
      .plus(result.sdIncentives);
    expect(normalize(result.lIncentives, 18)).toBe('0.02391615196507303165');
    expect(normalize(result.vdIncentives, 18)).toBe('0');
    expect(normalize(result.sdIncentives, 18)).toBe('0');
    expect(normalize(total, 18)).toBe('0.02391615196507303165');
  });
});
