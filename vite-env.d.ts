/// <reference types="vite/client" />
type ClientEnvironment = import("./env").ClientEnvironment;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImportMetaEnv extends ClientEnvironment {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
