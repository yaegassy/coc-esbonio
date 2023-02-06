import { workspace } from 'coc.nvim';
import semver from 'semver';

/**
 * Client
 */

export function getConfigEsbonioEnable() {
  return workspace.getConfiguration('esbonio').get<boolean>('enable', true);
}

export function getConfigEnableFixDirectiveCompletion() {
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

/**
 * Server
 */

export function getConfigServerEnabled() {
  return workspace.getConfiguration('esbonio').get<boolean>('server.enabled', true);
}

export function getConfigServerPythonPath() {
  return workspace.getConfiguration('esbonio').get<string>('server.pythonPath', '');
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

export function getConfigServerShowDeprecationWarnings() {
  return workspace.getConfiguration('esbonio').get<boolean>('server.showDeprecationWarnings', false);
}

export function getConfigServerCompletionPreferredInsertBehavior() {
  return workspace.getConfiguration('esbonio').get<string>('server.completion.preferredInsertBehavior', 'replace');
}

/**
 * Sphinx
 */

export function getConfigSphinxForceFullBuild(version: string): boolean | undefined {
  try {
    if (semver.gte(version, '0.11.0')) {
      return workspace.getConfiguration('esbonio').get<boolean>('sphinx.forceFullBuild', false);
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

export function getConfigSphinxBuildDir() {
  return workspace.getConfiguration('esbonio').get<string | null>('sphinx.buildDir', null);
}

export function getConfigSphinxBuilderName() {
  return workspace.getConfiguration('esbonio').get<string>('sphinx.builderName', '');
}

export function getConfigSphinxDoctreeDir() {
  return workspace.getConfiguration('esbonio').get<string | null>('sphinx.doctreeDir', null);
}

export function getConfigSphinxKeepGoing() {
  return workspace.getConfiguration('esbonio').get<boolean>('sphinx.keepGoing', false);
}

export function getConfigSphinxMakeMode() {
  return workspace.getConfiguration('esbonio').get<boolean>('sphinx.makeMode', true);
}

export function getConfigSphinxQuiet() {
  return workspace.getConfiguration('esbonio').get<boolean>('sphinx.quiet', false);
}

export function getConfigSphinxSilent() {
  return workspace.getConfiguration('esbonio').get<boolean>('sphinx.silent', false);
}

export function getConfigSphinxTags() {
  return workspace.getConfiguration('esbonio').get<string[]>('sphinx.tags', []);
}

export function getConfigSphinxVerbosity() {
  return workspace.getConfiguration('esbonio').get<number>('sphinx.verbosity', 0);
}

export function getConfigSphinxWarningIsError() {
  return workspace.getConfiguration('esbonio').get<boolean>('sphinx.warningIsError', false);
}

export function getConfigSphinxConfigOverrides() {
  return workspace.getConfiguration('esbonio').get<object>('sphinx.configOverrides', {});
}

export function getConfigSphinxSrcDir() {
  return workspace.getConfiguration('esbonio').get<string>('sphinx.srcDir', '');
}

export function getConfigSphinxConfDir() {
  return workspace.getConfiguration('esbonio').get<string>('sphinx.confDir', '');
}
