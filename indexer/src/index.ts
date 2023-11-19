import {MergedAbis, JSProcessor, fromJSProcessor} from 'ethereum-indexer-js-processor';
import contractsInfo from './contracts';

import type {Data, Trophy} from './types';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const VitalikSecretIndexerProcessor: JSProcessor<MergedAbis<typeof contractsInfo.contracts>, Data> = {
	// version is automatically populated via version.cjs to let the browser knows to reindex on changes
	version: '__VERSION_HASH__',
	construct(): Data {
		// you return here the starting state, here an empty array for the greetings
		return {owners: [], trophies: []};
	},
	onTransfer(data, event) {
		const to = event.args.to;

		const tokenID = event.args.tokenID.toString();

		let trophy: Trophy | undefined;
		let index = data.trophies.findIndex((v) => v.tokenID === tokenID);
		if (index !== -1) {
			trophy = data.trophies[index];
		}

		if (!trophy) {
			trophy = {
				tokenID,
				owner: to,
			};
			data.trophies.push(trophy);
		} else {
			if (to === ZERO_ADDRESS) {
				data.trophies.splice(index, 1);
				return;
			} else {
				trophy.owner = to;
			}
		}
	},
};

export const createProcessor = fromJSProcessor(() => VitalikSecretIndexerProcessor);
