import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { PairCreated as PairCreatedEvent } from "../generated/PancakeFactory/PancakeFactory"
import { Pair, PairCreated, PancakeFactory, Token } from "../generated/schema"
import { FACTORY_ADDRESS, fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from "./const";

export function handlePairCreated(event: PairCreatedEvent): void {
  let factory = PancakeFactory.load(Bytes.fromHexString(FACTORY_ADDRESS));
  if (factory === null) {
    factory = new PancakeFactory(Bytes.fromHexString(FACTORY_ADDRESS));
    factory.totalPairs = BigInt.fromI32(0);
  }
  factory.totalPairs = factory.totalPairs.plus(BigInt.fromI32(1));
  factory.save();

  let token0 = Token.load(event.params.token0);
  if (token0 === null) {
    token0 = new Token(event.params.token0);
    token0.name = fetchTokenName(event.params.token0);
    token0.symbol = fetchTokenSymbol(event.params.token0);
    let decimals = fetchTokenDecimals(event.params.token0);
    if (decimals === null) {
      return;
    }
    token0.decimals = decimals;
    token0.save();
  }

  let token1 = Token.load(event.params.token1);
  if (token1 === null) {
    token1 = new Token(event.params.token1);
    token1.name = fetchTokenName(event.params.token1);
    token1.symbol = fetchTokenSymbol(event.params.token1);
    let decimals = fetchTokenDecimals(event.params.token1);
    if (decimals === null) {
      return;
    }
    token1.decimals = decimals;
    token1.save();
  }

  let pair = new Pair(event.params.pair);
  pair.token0 = token0.id;
  pair.token1 = token1.id;
  pair.name = token0.symbol.concat("-").concat(token1.symbol);
  pair.block = event.block.number;
  pair.timestamp = event.block.timestamp;
  pair.save();

}