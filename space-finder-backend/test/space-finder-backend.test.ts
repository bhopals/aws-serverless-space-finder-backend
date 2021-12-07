import { Template, Match } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as SpaceFinderBackend from '../lib/space-finder-backend-stack';

test('SQS Queue Created', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new SpaceFinderBackend.SpaceFinderBackendStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300
  });
});

test('SNS Topic Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new SpaceFinderBackend.SpaceFinderBackendStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::SNS::Topic', 1);
});
