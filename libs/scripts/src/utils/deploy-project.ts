/* eslint-disable no-control-regex */
import { green, red } from 'chalk';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
type ExtractDeployedURLFromCommandResultType = {
  app: string;
  deploymentCommandResult: string;
  deploymentCommand: string;
};

type DeployProjectType = {
  app: string;
  deploymentCommand: string;
};

type DeployedProjectType = {
  name: string;
  url: string;
};

export const extractDeployedURLFromCommandResult = ({ app, deploymentCommandResult, deploymentCommand }: ExtractDeployedURLFromCommandResultType) => {
  const resultLines = deploymentCommandResult.split('\n');
  const deployedLink = resultLines.reverse().find((line) => line.trim().startsWith(`https://`));
  if (deployedLink) {
    const url = deployedLink.trim();
    console.log(`${red(`${deploymentCommand} URL for ${app.toUpperCase()}`)}: ${green(url)}`);
    return url;
  } else {
    throw new Error(`${app} URL not found in the command output from this command result: ${deploymentCommandResult}`);
  }
};

export const runDeploymentCommand = async ({ deploymentCommand, app }: DeployProjectType) => {
  const command = `npx nx ${deploymentCommand} ${app} --verbose`;
  const deploymentCommandResult = execSync(command, { stdio: ['inherit'] })
    .toString()
    .trim();

  console.log(green(`Preview command result for ${app}`));
  console.log(deploymentCommandResult);

  return deploymentCommandResult;
};

export const handleError = (error: any) => {
  console.error(red('Deployment error details:'), error);
  
  if (error.stderr) {
    console.error(red('Error stderr:'), error.stderr.toString());
    throw new Error(`Deployment failed: ${error.stderr.toString()}`);
  } else if (error.message) {
    console.error(red('Error message:'), error.message);
    throw new Error(`Deployment failed: ${error.message}`);
  } else {
    console.error(red('Unknown error:'), error);
    throw new Error(`Deployment failed: ${JSON.stringify(error)}`);
  }
};

export const deployProject = async ({ deploymentCommand, app }: DeployProjectType) => {
  console.log(green(`Running ${deploymentCommand} command on ${app}`));

  if (deploymentCommand === 'preview') {
    console.log(green(`Handling preview deployment for ${app} with enhanced safety checks.`));

    // 1. Get project root
    const projectConfig = JSON.parse(execSync(`npx nx show project ${app}`).toString().trim());
    const projectRoot = projectConfig.root;
    if (!projectRoot) {
      throw new Error(`Could not determine root directory for project ${app}.`);
    }

    // 2. Ensure .env file exists. Vercel CLI needs at least an empty .env file.
    const envFilePath = path.join(projectRoot, '.env');
    if (!fs.existsSync(envFilePath)) {
      console.log(`[${app}] .env file not found. Creating empty .env file at ${envFilePath}`);
      fs.writeFileSync(envFilePath, '');
    }
    const envPreviewFilePath = path.join(projectRoot, '.env.preview');
    if (!fs.existsSync(envPreviewFilePath)) {
      console.log(`[${app}] .env.preview file not found. Creating empty .env.preview file at ${envPreviewFilePath}`);
      fs.writeFileSync(envPreviewFilePath, '');
    }

    // 3. Validate required Vercel environment variables from process.env
    const { VERCEL_PROJECT_ID } = process.env;
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    const VERCEL_ORG_ID = process.env.VERCEL_ORG_ID || 'team_0ASDilhqwPl5fll9OnzqDM30';

    console.log(green(`Environment variables check for ${app}:`));
    console.log(`VERCEL_PROJECT_ID: ${VERCEL_PROJECT_ID ? 'SET' : 'NOT SET'}`);
    console.log(`VERCEL_TOKEN: ${VERCEL_TOKEN ? 'SET' : 'NOT SET'}`);
    console.log(`VERCEL_ORG_ID: ${VERCEL_ORG_ID}`);

    if (!VERCEL_PROJECT_ID) {
      console.warn(red(`Warning: Missing VERCEL_PROJECT_ID environment variable for ${app}. Vercel preview might fail or use a wrong project.`));
    }
    if (!VERCEL_TOKEN) {
      throw new Error(`Missing VERCEL_TOKEN environment variable. This is required for all Vercel deployments. Please set VERCEL_TOKEN in your environment.`);
    }

    // 4. Construct and execute safe commands
    // We construct the command carefully to avoid errors with empty variables.
    const vercelPullCommand = `npx vercel pull --yes --environment=preview --token=${VERCEL_TOKEN}`;
    const vercelBuildCommand = `npx vercel build --token=${VERCEL_TOKEN}`;
    const vercelDeployCommand = `npx vercel --prebuilt --token=${VERCEL_TOKEN}`;

    try {
      console.log(`\n> Setting project context with: vercel pull`);
      if (VERCEL_PROJECT_ID) {
        // Only link project if ID is present
        execSync(vercelPullCommand, { stdio: 'inherit', cwd: projectRoot });
      } else {
        console.log(`Skipping 'vercel pull' because VERCEL_PROJECT_ID is not set.`);
      }

      console.log(`\n> Executing: ${vercelBuildCommand}\n`);
      execSync(vercelBuildCommand, { stdio: 'inherit', cwd: projectRoot });

      // Check if .vercel/output exists after build
      const vercelOutputPath = path.join(projectRoot, '.vercel', 'output');
      if (!fs.existsSync(vercelOutputPath)) {
        throw new Error(`Build completed but .vercel/output directory not found at ${vercelOutputPath}. Build may have failed.`);
      }
      console.log(green(`✓ .vercel/output directory found at ${vercelOutputPath}`));

      console.log(`\n> Executing: ${vercelDeployCommand}\n`);
      const deploymentCommandResult = execSync(vercelDeployCommand, { stdio: 'pipe', cwd: projectRoot }).toString().trim();

      console.log(green(`Preview command result for ${app}`));
      console.log(deploymentCommandResult);

      const deployedLink = extractDeployedURLFromCommandResult({ app, deploymentCommandResult, deploymentCommand });
      return deployedLink;
    } catch (error) {
      console.error(red(`Failed to execute preview deployment for ${app}.`));
      handleError(error);
    }
  }

  // Fallback to original logic for other commands
  const deploymentCommandResult = await runDeploymentCommand({ app, deploymentCommand });
  const deployedLink = extractDeployedURLFromCommandResult({ app, deploymentCommandResult, deploymentCommand });
  return deployedLink;
};

const deployProjectsInSequence = async (affectedApps: string[], deploymentCommand: string): Promise<DeployedProjectType[]> => {
  const deployedProjects: DeployedProjectType[] = [];

  for (const app of affectedApps) {
    const url = await deployProject({ app, deploymentCommand });
    deployedProjects.push({ name: app, url });
  }

  return deployedProjects;
};

export const deployProjects = async (affectedApps: string[], deploymentCommand: string): Promise<DeployedProjectType[]> => {
  try {
    return await deployProjectsInSequence(affectedApps, deploymentCommand);
  } catch (error) {
    console.error(`Error occurred during deployment while running ${deploymentCommand}: ${error.message}`);
    handleError(error);
  }
};
