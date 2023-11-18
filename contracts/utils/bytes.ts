export function toHex(str: string): `0x${string}` {
	const res: string[] = [];
	const len = str.length;
	for (let n = 0, l = len; n < l; n++) {
		const hex = Number(str.charCodeAt(n)).toString(16);
		res.push(hex);
	}
	return ('0x' + res.join('')) as `0x${string}`;
}
