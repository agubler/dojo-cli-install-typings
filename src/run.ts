import { Argv } from 'yargs';
import { Helper } from 'dojo-cli/interfaces';

const typings: any = require('typings-core');

export interface TypingsArgs extends Argv {
	directory: string;
}

export default async function(helper: Helper, args: TypingsArgs) {
	await typings.install({ cwd: args.directory});
}
