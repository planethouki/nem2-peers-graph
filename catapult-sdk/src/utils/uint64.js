/*
 * Copyright (c) 2016-present,
 * Jaguar0625, gimre, BloodyRookie, Tech Bureau, Corp. All rights reserved.
 *
 * This file is part of Catapult.
 *
 * Catapult is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Catapult is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Catapult.  If not, see <http://www.gnu.org/licenses/>.
 */

/** @module utils/uint64 */

const convert = require('./convert');

const readUint32At = (bytes, i) => (bytes[i] + (bytes[i + 1] << 8) + (bytes[i + 2] << 16) + (bytes[i + 3] << 24)) >>> 0;

/**
 * An exact uint64 representation composed of two 32bit values.
 * @typedef {Array} uint64
 * @property {numeric} 0 Low 32bit value.
 * @property {numeric} 1 High 32bit value.
 */
const uint64Module = {
	/**
	 * Tries to compact a uint64 into a simple numeric.
	 * @param {module:utils/uint64~uint64} uint64 A uint64 value.
	 * @returns {numeric|module:utils/uint64~uint64}
	 * A numeric if the uint64 is no greater than Number.MAX_SAFE_INTEGER or the original uint64 value otherwise.
	 */
	compact: uint64 => {
		const low = uint64[0];
		const high = uint64[1];

		// don't compact if the value is >= 2^53
		if (0x00200000 <= high)
			return uint64;

		// multiply because javascript bit operations operate on 32bit values
		return (high * 0x100000000) + low;
	},

	/**
	 * Converts a numeric unsigned integer into a uint64.
	 * @param {Numeric} number Unsigned integer.
	 * @returns {module:utils/uint64~uint64} Uint64 representation of the input.
	 */
	fromUint: number => {
		const value = [(number & 0xFFFFFFFF) >>> 0, (number / 0x100000000) >>> 0];
		if (0x00200000 <= value[1] || 0 > number || 0 !== (number % 1))
			throw Error(`number cannot be converted to uint '${number}'`);

		return value;
	},

	/**
	 * Converts a (64bit) uint8 array into a uint64.
	 * @param {Uint8Array} uint8Array A uint8 array.
	 * @returns {module:utils/uint64~uint64} Uint64 representation of the input.
	 */
	fromBytes: uint8Array => {
		if (8 !== uint8Array.length)
			throw Error(`byte array has unexpected size '${uint8Array.length}'`);

		return [readUint32At(uint8Array, 0), readUint32At(uint8Array, 4)];
	},

	/**
	 * Converts a (32bit) uint8 array into a uint64.
	 * @param {Uint8Array} uint8Array A uint8 array.
	 * @returns {module:utils/uint64~uint64} Uint64 representation of the input.
	 */
	fromBytes32: uint8Array => {
		if (4 !== uint8Array.length)
			throw Error(`byte array has unexpected size '${uint8Array.length}'`);

		return [readUint32At(uint8Array, 0), 0];
	},

	/**
	 * Parses a hex string into a uint64.
	 * @param {string} input A hex encoded string.
	 * @returns {module:utils/uint64~uint64} Uint64 representation of the input.
	 */
	fromHex: input => {
		if (16 !== input.length)
			throw Error(`hex string has unexpected size '${input.length}'`);

		const uint8Array = convert.hexToUint8(input);
		const view = new DataView(uint8Array.buffer);
		return [view.getUint32(4), view.getUint32(0)];
	},

	/**
	 * Converts a uint64 into a hex string.
	 * @param {module:utils/uint64~uint64} uint64 A uint64 value.
	 * @returns {string} A hex encoded string representing the uint64.
	 */
	toHex: uint64 => {
		const uint32Array = new Uint32Array(uint64);
		const uint8Array = convert.uint32ToUint8(uint32Array).reverse();
		return convert.uint8ToHex(uint8Array);
	},

	/**
	 * Returns true if a uint64 is zero.
	 * @param {module:utils/uint64~uint64} uint64 A uint64 value.
	 * @returns {boolean} true if the value is zero.
	 */
	isZero: uint64 => 0 === uint64[0] && 0 === uint64[1],

	/**
	 * Converts a uint64 into a numeric string.
	 * @param {module:utils/uint64~uint64} uint64 A uint64 value.
	 * @returns {string} A numeric string representation of the input.
	 */
	toString: uint64 => {
		const hexUint64 = uint64Module.toHex(uint64);
		const digits = [0];
		for (let i = 0; i < hexUint64.length; i += 1) {
			let carry = parseInt(hexUint64.charAt(i), 16);
			for (let j = 0; j < digits.length; j += 1) {
				digits[j] = (digits[j] * 16) + carry;
				carry = digits[j] / 10 | 0;
				digits[j] %= 10;
			}
			while (0 < carry) {
				digits.push(carry % 10);
				carry = carry / 10 | 0;
			}
		}
		return digits.reverse().join('');
	}
};

module.exports = uint64Module;
