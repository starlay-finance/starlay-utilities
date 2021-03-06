/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { utils } from 'ethers';
import {
  amount0OrPositiveValidator,
  amountGtThan0OrMinus1,
  amountGtThan0Validator,
  isEthAddressArrayValidator,
  // isEthAddressArrayValidatorNotEmpty,
  isEthAddressOrEnsValidator,
  isEthAddressValidator,
  // optionalValidator,
} from './validations';

export function LPValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    // @ts-expect-error todo: check why this ignore is needed
    if (!utils.isAddress(this.lendingPoolAddress)) {
      console.error(`[LendingPoolValidator] You need to pass valid addresses`);
      return [];
    }

    isEthAddressValidator(target, propertyName, arguments);

    amountGtThan0Validator(target, propertyName, arguments);

    amountGtThan0OrMinus1(target, propertyName, arguments);

    amount0OrPositiveValidator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function LeveragerValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    // @ts-expect-error todo: check why this ignore is needed
    if (!utils.isAddress(this.leveragerAddress)) {
      console.error(`[LeveragerValidator] You need to pass valid addresses`);
      return [];
    }

    isEthAddressValidator(target, propertyName, arguments);

    amountGtThan0Validator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function LaunchpadValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    // @ts-expect-error todo: check why this ignore is needed
    if (!utils.isAddress(this.launchpadAddress)) {
      console.error(`[LaunchpadValidator] You need to pass valid addresses`);
      return [];
    }

    isEthAddressValidator(target, propertyName, arguments);

    amountGtThan0Validator(target, propertyName, arguments);

    amount0OrPositiveValidator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

// export function LTAMigratorValidator(
//   target: any,
//   propertyName: string,
//   descriptor: TypedPropertyDescriptor<any>,
// ): any {
//   const method = descriptor.value;
//   descriptor.value = function () {
//     const LEND_TO_AAVE_MIGRATOR =
//       // @ts-expect-error todo: check why this ignore is needed
//       this.migratorConfig?.LEND_TO_AAVE_MIGRATOR || '';

//     if (!utils.isAddress(LEND_TO_AAVE_MIGRATOR)) {
//       console.error(`[MigratorValidator] You need to pass valid addresses`);
//       return [];
//     }

//     isEthAddressValidator(target, propertyName, arguments);

//     amountGtThan0Validator(target, propertyName, arguments);

//     return method?.apply(this, arguments);
//   };
// }

export function IncentivesValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    isEthAddressValidator(target, propertyName, arguments);

    isEthAddressArrayValidator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function DebtTokenValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    isEthAddressValidator(target, propertyName, arguments);

    amountGtThan0Validator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function SynthetixValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    isEthAddressValidator(target, propertyName, arguments);

    amountGtThan0Validator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function ERC20Validator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    isEthAddressValidator(target, propertyName, arguments);

    amountGtThan0Validator(target, propertyName, arguments);

    amountGtThan0OrMinus1(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function StakingValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    if (
      // @ts-expect-error todo: check why this ignore is needed
      !utils.isAddress(this.stakingContractAddress)
    ) {
      console.error(`[StakingValidator] You need to pass valid addresses`);
      return [];
    }

    isEthAddressValidator(target, propertyName, arguments);

    amountGtThan0Validator(target, propertyName, arguments);

    amountGtThan0OrMinus1(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function SignStakingValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    if (
      // @ts-expect-error todo: check why this ignore is needed
      !utils.isAddress(this.stakingContractAddress) ||
      // @ts-expect-error todo: check why this ignore is needed
      !utils.isAddress(this.stakingHelperContractAddress)
    ) {
      console.error(`[StakingValidator] You need to pass valid addresses`);
      return [];
    }

    isEthAddressValidator(target, propertyName, arguments);

    amountGtThan0Validator(target, propertyName, arguments);

    amount0OrPositiveValidator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function FaucetValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    // @ts-expect-error todo: check why this ignore is needed
    if (!utils.isAddress(this.faucetAddress)) {
      console.error(`[FaucetValidator] You need to pass valid addresses`);
      return [];
    }

    isEthAddressValidator(target, propertyName, arguments);

    amountGtThan0Validator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function WETHValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    // @ts-expect-error todo: check why this ignore is needed
    if (!utils.isAddress(this.wethGatewayAddress)) {
      console.error(`[WethGatewayValidator] You need to pass valid addresses`);
      return [];
    }

    isEthAddressValidator(target, propertyName, arguments);

    amountGtThan0Validator(target, propertyName, arguments);

    amountGtThan0OrMinus1(target, propertyName, arguments);

    amount0OrPositiveValidator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function GovHelperValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    if (
      // @ts-expect-error todo: check why this ignore is needed
      !utils.isAddress(this.aaveGovernanceV2Address) ||
      // @ts-expect-error todo: check why this ignore is needed
      !utils.isAddress(this.aaveGovernanceV2HelperAddress)
    ) {
      console.error(`[GovernanceValidator] You need to pass valid addresses`);
      return [];
    }

    isEthAddressValidator(target, propertyName, arguments);

    amount0OrPositiveValidator(target, propertyName, arguments);

    isEthAddressArrayValidator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function GovValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    if (
      // @ts-expect-error todo: check why this ignore is needed
      !utils.isAddress(this.aaveGovernanceV2Address)
    ) {
      console.error(`[GovernanceValidator] You need to pass valid addresses`);
      return [];
    }

    isEthAddressValidator(target, propertyName, arguments);

    amount0OrPositiveValidator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}

export function GovDelegationValidator(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): any {
  const method = descriptor.value;
  descriptor.value = function () {
    isEthAddressValidator(target, propertyName, arguments);
    isEthAddressOrEnsValidator(target, propertyName, arguments);
    amountGtThan0Validator(target, propertyName, arguments);
    amount0OrPositiveValidator(target, propertyName, arguments);

    return method.apply(this, arguments);
  };
}
