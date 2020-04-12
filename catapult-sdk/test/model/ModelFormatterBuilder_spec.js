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

const ModelFormatterBuilder = require('../../src/model/ModelFormatterBuilder');
const ModelSchemaBuilder = require('../../src/model/ModelSchemaBuilder');
const ModelType = require('../../src/model/ModelType');
const { expect } = require('chai');

const modelSchema = new ModelSchemaBuilder().build();
const formattingRules = {
	[ModelType.none]: () => 'none',
	[ModelType.binary]: () => 'binary',
	[ModelType.uint64]: () => 'uint64',
	[ModelType.uint64HexIdentifier]: () => 'uint64HexIdentifier',
	[ModelType.objectId]: () => 'objectId',
	[ModelType.string]: () => 'string'
};

describe('model formatter builder', () => {
	describe('for built in formatter', () => {
		it('can create default formatter', () => {
			// Arrange:
			const formatter = new ModelFormatterBuilder().build(modelSchema, formattingRules);

			// Act:
			const subFormatterTypes = Object.keys(formatter);

			// Assert:
			expect(subFormatterTypes).to.deep.equal([
				'accountWithMetadata',
				'blockHeaderWithMetadata',
				'blockHeaderWithMetadataAndId',
				'transactionWithMetadata',

				'chainStatistic',
				'chainStatisticCurrent',
				'merkleProofInfo',
				'nodeHealth',
				'nodeInfo',
				'nodeTime',
				'serverInfo',
				'stateTree',
				'storageInfo',
				'transactionStatus'
			]);
		});

		it('can format transaction with metadata', () => {
			// Arrange:
			const formatter = new ModelFormatterBuilder().build(modelSchema, formattingRules);

			// Act:
			const result = formatter.transactionWithMetadata.format({
				meta: {
					id: 0,
					height: 0,
					hash: 0
				},
				transaction: {
					signature: 0,
					signerPublicKey: 0,
					version: 0,
					type: 0,

					maxFee: 0,
					deadline: 0
				}
			});

			// Assert:
			expect(result).to.deep.equal({
				meta: {
					id: 'objectId',
					height: 'uint64',
					hash: 'binary'
				},
				transaction: {
					signature: 'binary',
					signerPublicKey: 'binary',
					version: 'none',
					type: 'none',

					maxFee: 'uint64',
					deadline: 'uint64'
				}
			});
		});

		it('can format block header with metadata', () => {
			// Arrange:
			const formatter = new ModelFormatterBuilder().build(modelSchema, formattingRules);

			// Act:
			const result = formatter.blockHeaderWithMetadata.format({
				meta: {
					hash: 0,
					generationHash: 0,
					totalFee: 0,
					numTransactions: 0,
					stateHashSubCacheMerkleRoots: [0]
				},
				block: {
					signature: 0,
					signerPublicKey: 0,
					version: 0,
					type: 0,

					height: 0,
					timestamp: 0,
					difficulty: 0,
					previousBlockHash: 0,
					transactionsHash: 0,
					receiptsHash: 0,
					stateHash: 0,
					beneficiaryPublicKey: 0
				}
			});

			// Assert:
			expect(result).to.deep.equal({
				meta: {
					hash: 'binary',
					generationHash: 'binary',
					totalFee: 'uint64',
					numTransactions: 'none',
					stateHashSubCacheMerkleRoots: ['binary']
				},
				block: {
					signature: 'binary',
					signerPublicKey: 'binary',
					version: 'none',
					type: 'none',

					height: 'uint64',
					timestamp: 'uint64',
					difficulty: 'uint64',
					previousBlockHash: 'binary',
					transactionsHash: 'binary',
					receiptsHash: 'binary',
					stateHash: 'binary',
					beneficiaryPublicKey: 'binary'
				}
			});
		});

		it('can format block header with metadata and Id', () => {
			// Arrange:
			const formatter = new ModelFormatterBuilder().build(modelSchema, formattingRules);

			// Act:
			const result = formatter.blockHeaderWithMetadataAndId.format({
				id: 0x5E3CD1498E18164DD5536133,
				meta: {
					hash: 0,
					generationHash: 0,
					totalFee: 0,
					numTransactions: 0,
					stateHashSubCacheMerkleRoots: [0]
				},
				block: {
					signature: 0,
					signerPublicKey: 0,
					version: 0,
					type: 0,

					height: 0,
					timestamp: 0,
					difficulty: 0,
					previousBlockHash: 0,
					transactionsHash: 0,
					receiptsHash: 0,
					stateHash: 0,
					beneficiaryPublicKey: 0
				}
			});

			// Assert:
			expect(result).to.deep.equal({
				id: 'objectId',
				meta: {
					hash: 'binary',
					generationHash: 'binary',
					totalFee: 'uint64',
					numTransactions: 'none',
					stateHashSubCacheMerkleRoots: ['binary']
				},
				block: {
					signature: 'binary',
					signerPublicKey: 'binary',
					version: 'none',
					type: 'none',

					height: 'uint64',
					timestamp: 'uint64',
					difficulty: 'uint64',
					previousBlockHash: 'binary',
					transactionsHash: 'binary',
					receiptsHash: 'binary',
					stateHash: 'binary',
					beneficiaryPublicKey: 'binary'
				}
			});
		});

		it('can format account with metadata', () => {
			// Arrange:
			const formatter = new ModelFormatterBuilder().build(modelSchema, formattingRules);

			// Act:
			const result = formatter.accountWithMetadata.format({
				meta: {
				},
				account: {
					address: 0,
					addressHeight: 0,
					publicKey: 0,
					publicKeyHeight: 0,
					importance: 0,
					importanceHeight: 0,
					mosaics: [
						{ id: 0, amount: 0 },
						{ id: 0, amount: 0 }
					]
				}
			});

			// Assert:
			expect(result).to.deep.equal({
				meta: {
				},
				account: {
					address: 'binary',
					addressHeight: 'uint64',
					publicKey: 'binary',
					publicKeyHeight: 'uint64',
					importance: 'uint64',
					importanceHeight: 'uint64',
					mosaics: [
						{ id: 'uint64HexIdentifier', amount: 'uint64' },
						{ id: 'uint64HexIdentifier', amount: 'uint64' }
					]
				}
			});
		});

		it('can format chain info', () => {
			// Arrange:
			const formatter = new ModelFormatterBuilder().build(modelSchema, formattingRules);

			// Act:
			const result = formatter.chainStatistic.format({
				current: {
					height: 0,
					scoreLow: 0,
					scoreHigh: 0
				}
			});

			// Assert:
			expect(result).to.deep.equal({
				current: {
					height: 'uint64',
					scoreLow: 'uint64',
					scoreHigh: 'uint64'
				}
			});
		});

		it('can format storage info', () => {
			// Arrange:
			const formatter = new ModelFormatterBuilder().build(modelSchema, formattingRules);

			// Act:
			const result = formatter.storageInfo.format({
				numBlocks: 0,
				numTransactions: 0,
				numAccounts: 0
			});

			// Assert:
			expect(result).to.deep.equal({
				numBlocks: 'none',
				numTransactions: 'none',
				numAccounts: 'none'
			});
		});
	});

	describe('for custom formatter', () => {
		it('can add arbitrary formatter', () => {
			// Arrange:
			const builder = new ModelFormatterBuilder();
			builder.addFormatter('mosaic');
			const formatter = builder.build(modelSchema, formattingRules);

			// Act:
			const subFormatterTypes = formatter.mosaic.format({ id: 0, amount: 0 });

			// Assert:
			expect(subFormatterTypes).to.deep.equal({ id: 'uint64HexIdentifier', amount: 'uint64' });
		});

		it('cannot add arbitrary formatter multiple times', () => {
			// Arrange:
			const builder = new ModelFormatterBuilder();
			builder.addFormatter('mosaic');

			// Act + Assert:
			expect(() => { builder.addFormatter('mosaic'); }).to.throw('formatter already registered');
		});
	});
});
