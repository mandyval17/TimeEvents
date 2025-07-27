declare module 'vite-plugin-eslint' {
  import { PluginOption } from 'vite';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugin: (options?: Record<string, any>) => PluginOption;
  export default plugin;
}
