import { BigInt } from '@graphprotocol/graph-ts'

import { BI_1 } from '../../commons'
// https://github.com/Uniswap/sdks/blob/30b98e09d0486cd5cc3e4360e3277eb7cb60d2d5/sdks/v3-sdk/src/utils/fullMath.ts#L4
export abstract class FullMath {
  public static mulDivRoundingUp(a: BigInt, b: BigInt, denominator: BigInt): BigInt {
    const product = a.times(b)
    let result = product.div(denominator)
    if (!product.mod(denominator).isZero()) result = result.plus(BI_1)
    return result
  }
}
