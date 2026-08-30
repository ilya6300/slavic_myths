/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEST_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __IS_TEST_MODE__: boolean;
