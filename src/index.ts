import {
  CancellationToken,
  commands,
  CompletionContext,
  CompletionItem,
  CompletionList,
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  Position,
  ProvideCompletionItemsSignature,
  ServerOptions,
  services,
  workspace,
  window,
  WorkspaceConfiguration,
} from 'coc.nvim';

import fs from 'fs';
import path from 'path';

import child_process from 'child_process';
import util from 'util';

import { esbonioLsInstall } from './installer';

const exec = util.promisify(child_process.exec);

// TODO: Enhancing python3 path-detect
function getPythonPath(config: WorkspaceConfiguration): string {
  // eslint-disable-next-line prefer-const
  let pythonPath = config.get<string>('pythonPath');
  if (pythonPath) {
    return pythonPath;
  }

  return 'python3';
}

export async function activate(context: ExtensionContext): Promise<void> {
  const { subscriptions } = context;
  const extensionConfig = workspace.getConfiguration('esbonio');
  const isEnable = extensionConfig.get<boolean>('enable', true);
  if (!isEnable) return;

  const extensionStoragePath = context.storagePath;
  if (!fs.existsSync(extensionStoragePath)) {
    fs.mkdirSync(extensionStoragePath);
    // Create a cache dir
    fs.mkdirSync(path.join(extensionStoragePath, 'sphinx'));
  }

  // MEMO: Priority for detecting "esbonio" in each python environment
  //
  // 1. esbonio.server.pythonPath setting
  // 2. Current python3 environment (e.g. venv and system global)
  // 3. builtin venv/bin/python
  let esbonioServerPythonPath = extensionConfig.get('server.pythonPath', '');
  if (esbonioServerPythonPath && !(await existsEnvEsbonio(esbonioServerPythonPath))) {
    window.showErrorMessage(`Exit, because "esbonio" does not exist in your "esbonio.server.pythonPath" setting`);
    return;
  }

  if (!esbonioServerPythonPath) {
    if (await existsEnvEsbonio(getPythonPath(extensionConfig))) {
      esbonioServerPythonPath = getPythonPath(extensionConfig);
    } else if (fs.existsSync(path.join(context.storagePath, 'esbonio', 'venv', 'bin', 'python'))) {
      if (await existsEnvEsbonio(path.join(context.storagePath, 'esbonio', 'venv', 'bin', 'python'))) {
        esbonioServerPythonPath = path.join(context.storagePath, 'esbonio', 'venv', 'bin', 'python');
      }
    }
  }

  // Install "esbonio[lsp]" if it does not exist.
  if (!esbonioServerPythonPath) {
    await installWrapper(context);
    esbonioServerPythonPath = path.join(context.storagePath, 'esbonio', 'venv', 'bin', 'python');
  }

  // If "esbonio[lsp]" does not exist completely, terminate the process.
  // ----
  // If you cancel the installation.
  if (!esbonioServerPythonPath) {
    window.showErrorMessage('Exit, because "esbonio" does not exist.');
    return;
  }

  const isFixDirectiveCompletion = extensionConfig.get<boolean>('enableFixDirectiveCompletion', true);

  const pythonArgs = [
    '-m',
    'esbonio',
    '--cache-dir',
    path.join(extensionStoragePath, 'sphinx'),
    '--log-level',
    extensionConfig.get<string>('server.logLevel', 'error'),
  ];

  if (extensionConfig.get<boolean>('server.hideSphinxOutput', false)) {
    pythonArgs.push('--hide-sphinx-output');
  }

  const logFilters = extensionConfig.get<string[]>('server.logFilter', []);
  if (logFilters) {
    logFilters.forEach((filterName) => {
      pythonArgs.push('--log-filter', filterName);
    });
  }

  const command = esbonioServerPythonPath;
  const serverOptions: ServerOptions = {
    command,
    args: pythonArgs,
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'rst' },
      // MEMO: In esbonio's original VSCode extension, python is also set as a documentSelector
      // MEMO: but coc-esbonio sets only rst.
      //{ scheme: 'file', language: 'python' },
    ],
    outputChannelName: 'esbonio',
    middleware: {
      provideCompletionItem: async (
        document,
        position: Position,
        context: CompletionContext,
        token: CancellationToken,
        next: ProvideCompletionItemsSignature
      ) => {
        const res = await Promise.resolve(next(document, position, context, token));
        const doc = workspace.getDocument(document.uri);
        if (!doc || !res) return [];

        const items: CompletionItem[] = res.hasOwnProperty('isIncomplete')
          ? (res as CompletionList).items
          : (res as CompletionItem[]);

        // MEMO:
        // -----
        // Unnecessary dots are inserted at the end of "directives" when completing them.
        //
        // VSCode extension seems to be fine, but coc.nvim has this symptom.
        //
        // Added a patch to adjust the textEdit.range.end.character returned by LS,
        // since it seems to be wrong.
        //
        // I've already added a dedicated setting to enable/disable it, just in case.
        if (isFixDirectiveCompletion) {
          items.forEach((e) => {
            if (e.detail === 'directive') {
              if (e.textEdit?.range) {
                e.textEdit.range.end.character = e.textEdit.range.end.character + 1;
              }
            }
          });
        }

        return items;
      },
    },
  };

  const client = new LanguageClient('esbonio', 'Esbonio Language Server', serverOptions, clientOptions);

  subscriptions.push(services.registLanguageClient(client));

  subscriptions.push(
    commands.registerCommand('esbonio.languageServer.install', async () => {
      await installWrapper(context);
    })
  );

  subscriptions.push(
    commands.registerCommand('esbonio.languageServer.restart', async () => {
      await client.stop();
      client.start();
    })
  );
}

async function installWrapper(context: ExtensionContext) {
  const msg = 'Install/Upgrade "esbonio[lsp]"?';
  context.workspaceState;

  let ret = 0;
  ret = await window.showQuickpick(['Yes', 'Cancel'], msg);
  if (ret === 0) {
    try {
      await esbonioLsInstall(context);
    } catch (e) {
      return;
    }
  } else {
    return;
  }
}

async function existsEnvEsbonio(pythonPath: string): Promise<boolean> {
  const checkCmd = `${pythonPath} -m esbonio -h`;
  try {
    await exec(checkCmd);
    return true;
  } catch (error) {
    return false;
  }
}
