import { deployProject } from '../utils/deploy-project';
import { red } from 'chalk';

const run = async () => {
  const app = process.argv[2];
  if (!app) {
    console.error(red('Project name must be provided.'));
    process.exit(1);
  }

  try {
    await deployProject({ app, deploymentCommand: 'preview' });
  } catch (error) {
    console.error(red(`An error occurred during the preview deployment: ${error.message}`));
    process.exit(1);
  }
};

run();
