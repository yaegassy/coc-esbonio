import {
  CancellationToken,
  commands,
  CompletionContext,
  CompletionItem,
  CompletionList,
  DocumentSelector,
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  languages,
  Position,
  ProvideCompletionItemsSignature,
  ServerOptions,
  ServiceStat,
  window,
  workspace,
} from 'coc.nvim';

import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import util from 'util';
import which from 'which';
import { EsbonioCodeActionProvider } from './action';
import { EditorCommands } from './command';
import {
  getConfigEnableFixDirectiveCompletion,
  getConfigEsbonioEnable,
  getConfigServerEnabled,
  getConfigServerEnabledInPyFiles,
  getConfigServerExcludedModules,
  getConfigServerHidSphinxOutput,
  getConfigServerIncludedModules,
  getConfigServerLogFilter,
  getConfigServerLogLevel,
  getConfigServerPythonPath,
  getConfigServerStartupModule,
  getConfigSphinxBuildDir,
  getConfigSphinxConfDir,
  getConfigSphinxForceFullBuild,
  getConfigSphinxNumJobs,
  getConfigSphinxSrcDir,
} from './config';
import { esbonioLsInstall } from './installer';

const exec = util.promisify(child_process.exec);

export async function activate(context: ExtensionContext): Promise<void> {
  if (!getConfigEsbonioEnable()) return;

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
  // 3. builtin venv python
  ////let esbonioServerPythonPath = extensionConfig.get('server.pythonPath', '');
  let esbonioServerPythonPath = getConfigServerPythonPath();
  if (esbonioServerPythonPath && !(await existsEnvEsbonio(esbonioServerPythonPath))) {
    window.showErrorMessage(`Exit, because "esbonio" does not exist in your "esbonio.server.pythonPath" setting`);
    return;
  }

  let pythonCommand = esbonioServerPythonPath;
  if (!pythonCommand) {
    pythonCommand = getPythonCommand();
  }

  if (!esbonioServerPythonPath) {
    if (await existsEnvEsbonio(pythonCommand)) {
      esbonioServerPythonPath = pythonCommand;
    } else if (
      fs.existsSync(path.join(context.storagePath, 'esbonio', 'venv', 'Scripts', 'python.exe')) ||
      fs.existsSync(path.join(context.storagePath, 'esbonio', 'venv', 'bin', 'python'))
    ) {
      if (process.platform === 'win32') {
        if (await existsEnvEsbonio(path.join(context.storagePath, 'esbonio', 'venv', 'Scripts', 'python.exe'))) {
          esbonioServerPythonPath = path.join(context.storagePath, 'esbonio', 'venv', 'Scripts', 'python.exe');
        }
      } else {
        if (await existsEnvEsbonio(path.join(context.storagePath, 'esbonio', 'venv', 'bin', 'python'))) {
          esbonioServerPythonPath = path.join(context.storagePath, 'esbonio', 'venv', 'bin', 'python');
        }
      }
    }
  }

  // Install "esbonio" if it does not exist.
  if (!esbonioServerPythonPath) {
    const isRealpath = true;
    const builtinInstallPythonCommand = getPythonCommand(isRealpath);
    await installWrapper(builtinInstallPythonCommand, context);
    if (process.platform === 'win32') {
      esbonioServerPythonPath = path.join(context.storagePath, 'esbonio', 'venv', 'Scripts', 'python.exe');
    } else {
      esbonioServerPythonPath = path.join(context.storagePath, 'esbonio', 'venv', 'bin', 'python');
    }
  }

  // If "esbonio" does not exist completely, terminate the process.
  // ----
  // If you cancel the installation.
  if (!esbonioServerPythonPath) {
    window.showErrorMessage('Exit, because "esbonio" does not exist.');
    return;
  }

  ////const isFixDirectiveCompletion = extensionConfig.get<boolean>('enableFixDirectiveCompletion', true);
  const isFixDirectiveCompletion = getConfigEnableFixDirectiveCompletion();

  let initializationOptions = {};
  let pythonArgs: string[] = [];

  const startupModule = getConfigServerStartupModule();
  if (startupModule.endsWith('.py') || startupModule.includes('/') || startupModule.includes('\\')) {
    pythonArgs.push(startupModule);
  } else {
    pythonArgs.push('-m', startupModule);
  }

  const esbonioVersion = await getEsbonioVersion(esbonioServerPythonPath);
  const requireInitializationOptions = isRequireInitializationOptions(esbonioVersion);

  if (requireInitializationOptions) {
    ////let buildDir = extensionConfig.get<string>('sphinx.buildDir', '');
    let buildDir = getConfigSphinxBuildDir();
    if (!buildDir) {
      buildDir = path.join(extensionStoragePath, 'sphinx');
    }

    initializationOptions = {
      sphinx: {
        ////srcDir: extensionConfig.get<string>('sphinx.srcDir'),
        srcDir: getConfigSphinxSrcDir(),
        ////confDir: extensionConfig.get<string>('sphinx.confDir'),
        confDir: getConfigSphinxConfDir(),
        forceFullBuild: getConfigSphinxForceFullBuild(esbonioVersion),
        numJobs: getConfigSphinxNumJobs(esbonioVersion) === 0 ? 'auto' : getConfigSphinxNumJobs(esbonioVersion),
        buildDir: buildDir,
      },
      server: {
        ////logLevel: extensionConfig.get<string>('server.logLevel', 'error'),
        logLevel: getConfigServerLogLevel(),
        ////logFilter: extensionConfig.get<string[]>('server.logFilter', []),
        logFilter: getConfigServerLogFilter(),
        ////hideSphinxOutput: extensionConfig.get<boolean>('server.hideSphinxOutput', false),
        hideSphinxOutput: getConfigServerHidSphinxOutput(),
      },
    };
  } else {
    pythonArgs = [
      '-m',
      'esbonio',
      '--cache-dir',
      path.join(extensionStoragePath, 'sphinx'),
      '--log-level',
      ////extensionConfig.get<string>('server.logLevel', 'error'),
      getConfigServerLogLevel(),
    ];

    if (getConfigServerHidSphinxOutput()) {
      pythonArgs.push('--hide-sphinx-output');
    }

    ////const logFilters = extensionConfig.get<string[]>('server.logFilter', []);
    const logFilters = getConfigServerLogFilter();
    if (logFilters) {
      logFilters.forEach((filterName) => {
        pythonArgs.push('--log-filter', filterName);
      });
    }
  }

  if (semver.gte(esbonioVersion, '0.9.0')) {
    ////extensionConfig.get<string[]>('server.includedModules', []).forEach((mod) => {
    getConfigServerIncludedModules().forEach((mod) => {
      pythonArgs.push('--include', mod);
    });

    ////extensionConfig.get<string[]>('server.excludedModules', []).forEach((mod) => {
    getConfigServerExcludedModules().forEach((mod) => {
      pythonArgs.push('--exclude', mod);
    });
  }

  const command = esbonioServerPythonPath;
  const serverOptions: ServerOptions = {
    command,
    args: pythonArgs,
  };

  const documentSelector: DocumentSelector = [
    { scheme: 'file', language: 'rst' },
    { scheme: 'file', language: 'restructuredtext' },
  ];

  if (getConfigServerEnabledInPyFiles()) {
    documentSelector.push({ scheme: 'file', language: 'python' });
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector,
    initializationOptions,
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

  const isServerEnabled = getConfigServerEnabled();
  if (isServerEnabled) {
    client.start();
  }

  context.subscriptions.push(
    commands.registerCommand('esbonio.languageServer.install', async () => {
      if (isServerEnabled) {
        const isRealpath = true;
        const builtinInstallPythonCommand = getPythonCommand(isRealpath);

        if (client.serviceState !== ServiceStat.Stopped) {
          await client.stop();
        }
        await installWrapper(builtinInstallPythonCommand, context);
        client.start();
      }
    })
  );

  context.subscriptions.push(
    commands.registerCommand('esbonio.languageServer.restart', async () => {
      if (isServerEnabled) {
        await client.stop();
        client.start();
      }
    })
  );

  const codeActionProvider = new EsbonioCodeActionProvider();
  context.subscriptions.push(
    languages.registerCodeActionProvider([{ scheme: 'file', language: 'rst' }], codeActionProvider, 'esbonio')
  );

  const editorCommand = new EditorCommands();
  editorCommand.register(context);
}

async function installWrapper(pythonCommand: string, context: ExtensionContext) {
  const msg = 'Install/Upgrade "esbonio"?';
  const ret = await window.showPrompt(msg);
  if (ret) {
    try {
      await esbonioLsInstall(pythonCommand, context);
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

function getPythonCommand(isRealpath?: boolean): string {
  let res = '';

  try {
    res = which.sync('python3');
    if (isRealpath) {
      res = fs.realpathSync(res);
    }
    return res;
  } catch (e) {
    // noop
  }

  try {
    res = which.sync('python');
    if (isRealpath) {
      res = fs.realpathSync(res);
    }
    return res;
  } catch (e) {
    // noop
  }

  return res;
}

async function getEsbonioVersion(pythonPath: string): Promise<string> {
  const checkCmd = `${pythonPath} -m esbonio --version`;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { stdout, stderr } = await exec(checkCmd);
    return stdout;
  } catch (error) {
    return '';
  }
}

// MEMO: v0.6.2 or later
//
// Cli options like --log-level have been removed in favour of configuration
// values.
// The server's initial configuration should be passed in through the
// initializationOptions field of the initialize request.
function isRequireInitializationOptions(version: string): boolean {
  try {
    return semver.gte(version, '0.6.2');
  } catch (e) {
    return true;
  }
}
