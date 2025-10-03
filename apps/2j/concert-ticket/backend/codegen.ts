import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'apps/2j/concert-ticket/backend/src/schemas',
  generates: {
    'apps/2j/concert-ticket/backend/src/generated/types.ts': {
      plugins: ['typescript'],
      config: {
        maybeValue: 'T'
      }
    },
    'apps/2j/concert-ticket/backend/src/generated/resolvers-types.ts': {
      plugins: ['typescript-resolvers'],
      config: {
        makeResolverTypeCallable: true,
        maybeValue: 'T'
      }
    }
  },
};

export default config;
