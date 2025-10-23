import type { CodegenConfig } from '@graphql-codegen/cli';

// CI / тест орчинд backend сервер асахгүй байж болох тул
// HTTP биш, локал файлын схем ашиглая. Харин dev орчинд HTTP ашиглана.
const isCI = process.env.CI === 'true' || process.env.NODE_ENV === 'test';

const schema: CodegenConfig['schema'] = isCI
  ? [
      // Backend-ийн SDL файлууд
      'apps/2j/concert-ticket/backend/src/schemas/schema.graphql',
      'apps/2j/concert-ticket/backend/src/schemas/common.schema.ts',
    ]
  : 'http://localhost:4000/api/graphql';

const config: CodegenConfig = {
  overwrite: true,
  schema,
  // Nx "codegen:*" нь workspace root-оос ажиллах тул absolute‑like проектын зам
  documents: ['src/**/*.graphql'],
  generates: {
    'src/generated/index.ts': {
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
