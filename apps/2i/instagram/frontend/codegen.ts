import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';

const schemaEndpoint =
  process.env.LOCAL_SCHEMA_FILE ??
  process.env.LOCAL_BACKEND_URI ??       
  process.env.BACKEND_URI ??
  'http://localhost:4200/graphql';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.LOCAL_BACKEND_URI ?? process.env.BACKEND_URI,
  documents: ['apps/2i/instagram/frontend/src/**/*.graphql'],
  generates: {
    'apps/2i/instagram/frontend/src/generated/index.ts': {
      config: {
        reactApolloVersion: 3,
        withHOC: true,
        withHooks: true,
      },
      plugins: [
        { add: { content: '// @ts-nocheck' } },
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
};

export default config;
