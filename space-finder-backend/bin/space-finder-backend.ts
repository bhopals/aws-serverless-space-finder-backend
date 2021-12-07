#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { SpaceFinderBackendStack } from '../lib/space-finder-backend-stack';

const app = new cdk.App();
new SpaceFinderBackendStack(app, 'SpaceFinderBackendStack');
