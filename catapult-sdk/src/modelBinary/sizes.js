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

/** @module modelBinary/sizes */

const sizes = {
	/**
	 * @property {numeric} Size of a signature.
	 */
	signature: 64,

	/**
	 * @property {numeric} Size of a signer public key.
	 */
	signerPublicKey: 32,

	/**
	 * @property {numeric} Size of a decoded address.
	 */
	addressDecoded: 25,

	/**
	 * @property {numeric} Size of a transaction header.
	 */
	transactionHeader: 4 + 4 + 64 + 32 + 4,

	/**
	 * @property {numeric} Size of a sha3 256 hash.
	 */
	hash256: 32,

	/**
	 * @property {numeric} Size of a sha3 512 hash.
	 */
	hash512: 64
};

module.exports = sizes;
