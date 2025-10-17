import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/api/graphql',
  // Nx "codegen:dev" root-оос ажиллах тул project-absolute зам ашиглая
  documents: ['apps/2j/concert-ticket/frontend/src/**/*.graphql'],
  generates: {
    'apps/2j/concert-ticket/frontend/src/generated/index.ts': {
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
