import { BigInt } from '@graphprotocol/graph-ts'

import { SqrtPriceMath } from './sqrtPriceMath'
import { TickMath } from './tickMath'
import { BI_0 } from '../../commons'

// https://github.com/Uniswap/v3-sdk/blob/4e16fe8e56c8c26541545f138c89133794c7ce72/src/entities/position.ts#L68-L127
export function getAmount0(tickLower: i32, tickUpper: i32, currTick: i32, amount: BigInt): BigInt {
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)
  const sqrtRatioCurrentX96 = TickMath.getSqrtRatioAtTick(currTick)

  let amount0 = BI_0

  if (currTick < tickLower) {
    amount0 = SqrtPriceMath.getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, amount, true)
  } else if (currTick < tickUpper) {
    amount0 = SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioBX96, amount, true)
  } else {
    amount0 = BI_0
  }

  return amount0
}

export function getAmount1(tickLower: i32, tickUpper: i32, currTick: i32, amount: BigInt): BigInt {
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)
  const sqrtRatioCurrentX96 = TickMath.getSqrtRatioAtTick(currTick)

  let amount1 = BI_0

  if (currTick < tickLower) {
    amount1 = BI_0
  } else if (currTick < tickUpper) {
    amount1 = SqrtPriceMath.getAmount1Delta(sqrtRatioAX96, sqrtRatioCurrentX96, amount, true)
  } else {
    amount1 = SqrtPriceMath.getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, amount, true)
  }

  return amount1
}
