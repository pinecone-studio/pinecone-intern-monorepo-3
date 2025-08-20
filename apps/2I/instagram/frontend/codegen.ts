import type { CodegenConfig } from '@graphql-codegen/cli';
import path from 'path';

const here = __dirname; 

const config: CodegenConfig = {
  overwrite: true,

  
  schema: path.resolve(here, 'schema.graphql'),


  documents: [path.resolve(here, 'src/**/*.{graphql,gql}')],

  generates: {

    [path.resolve(here, 'src/generated/index.ts')]: {
      config: {
        reactApolloVersion: 3,
        withHooks: true,
        withHOC: false,
      },
      plugins: [
        { add: { content: '// @ts-nocheck' } },
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },


  ignoreNoDocuments: true,
};

export default config;
