import { workspace } from 'coc.nvim';

export function getConfigServerEnabledInPyFiles() {
  return workspace.getConfiguration('esbonio').get<boolean>('server.enabledInPyFiles', false);
}

export function getConfigServerStartupModule() {
  return workspace.getConfiguration('esbonio').get<string>('server.startupModule', 'esbonio');
}
