import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as CommonTypeDefs } from './common.schema';
import { readFileSync } from 'fs';
import { join } from 'path';

// GraphQL schema файлыг унших
const schemaPath = join(__dirname, 'schema.graphql');
const schemaTypeDefs = readFileSync(schemaPath, 'utf8');

export const typeDefs = mergeTypeDefs([CommonTypeDefs, schemaTypeDefs]);
