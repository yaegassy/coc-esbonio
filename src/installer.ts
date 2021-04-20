import { ExtensionContext, window } from 'coc.nvim';

import path from 'path';

import rimraf from 'rimraf';
import child_process from 'child_process';
import util from 'util';

import { ESBONIO_LS_VERSION } from './constant';

const exec = util.promisify(child_process.exec);

export async function esbonioLsInstall(context: ExtensionContext): Promise<void> {
  const pathVenv = path.join(context.storagePath, 'esbonio', 'venv');
  const pathPip = path.join(pathVenv, 'bin', 'pip');

  const statusItem = window.createStatusBarItem(0, { progress: true });
  statusItem.text = `Install esbonio[lsp] ...`;
  statusItem.show();

  const installCmd =
    //`python3 -m venv ${pathVenv} && ` + `${pathPip} install -U pip 'esbonio[lsp]'==${ESBONIO_LS_VERSION}`;
    //
    // MEMO: Currently, if I install esbonio[lsp] normally, I cannot start it.  There is a version problem with pygls.
    // REF: I've already created the issue. <https://github.com/swyddfa/esbonio/issues/147>
    `python3 -m venv ${pathVenv} && ` + `${pathPip} install -U pip 'esbonio[lsp]'==${ESBONIO_LS_VERSION} pygls==0.9.1`;

  rimraf.sync(pathVenv);
  try {
    window.showWarningMessage(`Install esbonio[lsp]...`);
    await exec(installCmd);
    statusItem.hide();
    window.showWarningMessage(`esbonio[lsp]: installed!`);
  } catch (error) {
    statusItem.hide();
    window.showErrorMessage(`esbonio[lsp]: install failed. | ${error}`);
    throw new Error();
  }
}
