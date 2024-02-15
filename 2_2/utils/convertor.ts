import { BigNumber, Bytes, BytesLike, ethers } from 'ethers';

export function parseEther(value: string | number, precision = 18) {
    let temp = value.toString().split('.');
    if (temp[1]) {
        temp[1] = temp[1].substring(0, precision);
    }
    let result: BigNumber;
    result = ethers.utils.parseEther(
        Number(temp.join('.')).toFixed(precision).toString()
    );
    if (precision !== 18) {
        // if precision greater than 18
        if (precision > 18) {
            const adjustPrec = precision - 18;
            result = result.mul(10 ** adjustPrec);
        } else {
            const differ = 18 - precision;
            result = result.div(10 ** differ);
        }
    }
    return result;
}

export function days(value: number) {
    if (value < 0) throw Error('utils/days/value-less-than-zero');

    return value * 86400;
}

export function hours(value: number) {
    if (value < 0) throw Error('utils/hours/value-less-than-zero');

    return value * 3600;
}

// Convert a hex string to a byte array
export function hexToBytes(hex: string) {
    let bytes: any[] = [];
    hex = hex.replace('0x', '');
    for (let c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substring(c, c + 2), 16));
    return bytes as BytesLike;
}

// Convert a byte array to a hex string
export function bytesToHex(bytes: Bytes) {
    let hex: any[] = [];
    for (let i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xf).toString(16));
    }
    return hex.join('');
}

export function IsUsableValue(value: any) {
    return !['', '-', undefined, null].includes(value);
}

export function getTokenByAddress(object: any, value: any) {
    return Object.keys(object).find((key) => object[key].address === value);
}
export function getTokenByObjectAddress(object: any, value: any) {
    return Object.keys(object).find((key) => object[key] === value)!;
}