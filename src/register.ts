import { Helper } from 'dojo-cli/interfaces';
import { Yargs } from 'yargs';

export default function(helper: Helper): Yargs {
	helper.yargs.option('d', {
		alias: 'directory',
		describe: 'typings directory',
		default: '.'
	});

	return helper.yargs;
}
