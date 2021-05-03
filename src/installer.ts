import { ExtensionContext, window } from 'coc.nvim';

import path from 'path';

import rimraf from 'rimraf';
import child_process from 'child_process';
import util from 'util';

import { ESBONIO_LS_VERSION } from './constant';

const exec = util.promisify(child_process.exec);

export async function esbonioLsInstall(pythonCommand: string, context: ExtensionContext): Promise<void> {
  const pathVenv = path.join(context.storagePath, 'esbonio', 'venv');

  let pathVenvPython = path.join(context.storagePath, 'esbonio', 'venv', 'bin', 'python');
  if (process.platform === 'win32') {
    pathVenvPython = path.join(context.storagePath, 'esbonio', 'venv', 'Scripts', 'python');
  }

  const statusItem = window.createStatusBarItem(0, { progress: true });
  statusItem.text = `Install esbonio[lsp]...`;
  statusItem.show();

  const installCmd =
    `${pythonCommand} -m venv ${pathVenv} && ` +
    `${pathVenvPython} -m pip install -U pip esbonio[lsp]==${ESBONIO_LS_VERSION}`;

  rimraf.sync(pathVenv);
  try {
    window.showMessage(`Install esbonio[lsp]...`);
    await exec(installCmd);
    statusItem.hide();
    window.showMessage(`esbonio[lsp]: installed!`);
  } catch (error) {
    statusItem.hide();
    window.showErrorMessage(`esbonio[lsp]: install failed. | ${error}`);
    throw new Error();
  }
}
