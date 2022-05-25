import { workspace } from 'coc.nvim';
import semver from 'semver';

export function getConfigEsbonioEnable() {
  return workspace.getConfiguration('esbonio').get<boolean>('enable', true);
}

export function getConfigServerEnabled() {
  return workspace.getConfiguration('esbonio').get<boolean>('server.enabled', true);
}

export function getConfigServerPythonPath() {
  return workspace.getConfiguration('esbonio').get<string>('server.pythonPath', '');
}

export function getConfigEnableFixDirectiveCompletion() {
  // enableFixDirectiveCompletion
  return workspace.getConfiguration('esbonio').get<boolean>('enableFixDirectiveCompletion', true);
}

export function getConfigClientSectionCharacterLevel1() {
  return workspace.getConfiguration('esbonio').get<string>('client.sectionCharacterLevel1', '=');
}

export function getConfigClientSectionCharacterLevel2() {
  return workspace.getConfiguration('esbonio').get<string>('client.sectionCharacterLevel2', '-');
}

export function getConfigClientSectionCharacterLevel3() {
  return workspace.getConfiguration('esbonio').get<string>('client.sectionCharacterLevel3', '~');
}

export function getConfigSphinxBuildDir() {
  return workspace.getConfiguration('esbonio').get<string>('sphinx.buildDir', '');
}

export function getConfigSphinxSrcDir() {
  return workspace.getConfiguration('esbonio').get<string>('sphinx.srcDir', '');
}

export function getConfigSphinxConfDir() {
  return workspace.getConfiguration('esbonio').get<string>('sphinx.confDir', '');
}

export function getConfigServerLogLevel() {
  return workspace.getConfiguration('esbonio').get<string>('server.logLevel', 'error');
}

export function getConfigServerLogFilter() {
  return workspace.getConfiguration('esbonio').get<string[]>('server.logFilter', []);
}

export function getConfigServerHidSphinxOutput() {
  return workspace.getConfiguration('esbonio').get<boolean>('server.hideSphinxOutput', false);
}

export function getConfigServerIncludedModules() {
  return workspace.getConfiguration('esbonio').get<string[]>('server.includedModules', []);
}

export function getConfigServerExcludedModules() {
  return workspace.getConfiguration('esbonio').get<string[]>('server.excludedModules', []);
}

export function getConfigServerEnabledInPyFiles() {
  return workspace.getConfiguration('esbonio').get<boolean>('server.enabledInPyFiles', false);
}

export function getConfigServerStartupModule() {
  return workspace.getConfiguration('esbonio').get<string>('server.startupModule', 'esbonio');
}

export function getConfigSphinxForceFullBuild(version: string): boolean | undefined {
  try {
    if (semver.gte(version, '0.11.0')) {
      return workspace.getConfiguration('esbonio').get<boolean>('sphinx.forceFullBuild', true);
    }
  } catch (e) {
    return undefined;
  }
}

export function getConfigSphinxNumJobs(version: string): number | undefined {
  try {
    if (semver.gte(version, '0.11.0')) {
      return workspace.getConfiguration('esbonio').get<number>('sphinx.numJobs', 0);
    }
  } catch (e) {
    return undefined;
  }
}
