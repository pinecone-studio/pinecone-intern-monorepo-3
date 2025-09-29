import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.LOCAL_BACKEND_URI ?? process.env.BACKEND_URI ?? 'apps/2j/real-state/backend/src/schemas/**/*.ts',
  documents: ['apps/2j/real-state/frontend/src/**/*.graphql'],
  generates: {
    'apps/2j/real-state/frontend/src/generated/index.ts': {
      config: {
        reactApolloVersion: 3,
        withHOC: true,
        withHooks: true,
      },
      plugins: [
        {
          add: {
            content: '// @ts-nocheck',
          },
        },
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
};
export default config;
