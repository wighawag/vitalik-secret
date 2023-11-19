export type Owner = {
	address: string;
};

export type Trophy = {
	tokenID: string;
	owner: string;
};

export type Data = {
	trophies: Trophy[];
	owners: Owner[];
};
