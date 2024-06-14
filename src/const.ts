import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/PancakeFactory/ERC20"
import { ERC20SymbolBytes } from "../generated/PancakeFactory/ERC20SymbolBytes"
import { ERC20NameBytes } from "../generated/PancakeFactory/ERC20NameBytes"
export const FACTORY_ADDRESS = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";

export function isNullBnbValue(value: string): boolean {
    return value == "0x0000000000000000000000000000000000000000000000000000000000000001";
}


export function fetchTokenSymbol(tokenAddress: Address): string {
    let contract = ERC20.bind(tokenAddress);
    let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress);

    let symbolValue = "unknown";
    let symbolResult = contract.try_symbol();
    if (symbolResult.reverted) {
        let symbolResultBytes = contractSymbolBytes.try_symbol();
        if (!symbolResultBytes.reverted) {
            if (!isNullBnbValue(symbolResultBytes.value.toHex())) {
                symbolValue = symbolResultBytes.value.toString();
            }
        }
    } else {
        symbolValue = symbolResult.value;
    }
    return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
    let contract = ERC20.bind(tokenAddress);
    let contractNameBytes = ERC20NameBytes.bind(tokenAddress);

    let nameValue = "unknown";
    let nameResult = contract.try_name();
    if (nameResult.reverted) {
        let nameResultBytes = contractNameBytes.try_name();
        if (!nameResultBytes.reverted) {
            if (!isNullBnbValue(nameResultBytes.value.toHex())) {
                nameValue = nameResultBytes.value.toString();
            }
        }
    } else {
        nameValue = nameResult.value;
    }
    return nameValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
    let contract = ERC20.bind(tokenAddress);
    let decimalValue = BigInt.fromI32(0); // Initialize with 0
    let decimalResult = contract.try_decimals();
    if (!decimalResult.reverted) {
        decimalValue = BigInt.fromI32(decimalResult.value); // Directly assign the value
    }
    return decimalValue;
}