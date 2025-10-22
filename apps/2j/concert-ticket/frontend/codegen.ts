import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/api/graphql',
  documents: 'apps/2j/concert-ticket/frontend/src/graphql/**/*.graphql',
  generates: {
    'apps/2j/concert-ticket/frontend/src/generated/index.tsx': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
    },
  },
};

export default config;
