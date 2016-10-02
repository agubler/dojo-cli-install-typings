import { Argv } from 'yargs';
import { Helper } from 'dojo-cli/interfaces';
import * as typings from 'typings-core';
import * as archy from 'archy';
import * as chalk from 'chalk';

export interface TypingsArgs extends Argv {
	directory: string;
}

export interface ArchifyOptions {
	name?: string;
	tree: typings.DependencyTree;
	unicode?: boolean;
}

function toDependencyName (name: string, node: typings.DependencyTree, suffix?: string) {
	const fullname = node.version ? `${name}@${node.version}` : name;
	return suffix ? `${fullname} ${suffix}` : fullname;
}

function parseInstallResults(options: ArchifyOptions) {
	const result: archy.Data = {
		label: options.name ? toDependencyName(options.name, options.tree) : '',
		nodes: []
	};

	function children (nodes: (string | archy.Data)[], dependencies: typings.DependencyBranch, suffix?: string) {
		for (const name of Object.keys(dependencies).sort()) {
			const tree = dependencies[name];
			nodes.push(traverse(
				{
					label: toDependencyName(name, tree, suffix),
					nodes: []
				},
				tree
			));
		}
	}

	function traverse (result: archy.Data, tree: typings.DependencyTree) {
		const { nodes } = result;

		children(nodes, tree.dependencies);
		children(nodes, tree.devDependencies, chalk.gray('(dev)'));
		children(nodes, tree.peerDependencies, chalk.gray('(peer)'));
		children(nodes, tree.globalDependencies, chalk.gray('(global)'));
		children(nodes, tree.globalDevDependencies, chalk.gray('(global dev)'));

		return result;
	}

	const archyTree = traverse(result, options.tree);

	if (archyTree.nodes.length === 0) {
		archyTree.nodes.push(chalk.gray('(No dependencies)'));
	}

	return archy(archyTree, '', { unicode: options.unicode });
}

export default async function(helper: Helper, args: TypingsArgs) {
	console.info(chalk.underline('Installing typings'));
	const result: typings.InstallResult = await typings.install({ cwd: args.directory});
	console.info(parseInstallResults(result));
	console.info(chalk.green('successfully installed typings'));
}
