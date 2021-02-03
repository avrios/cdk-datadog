import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as DatadogMonitor from '../lib/index';

/*
 * Example test
 */
test('SNS Topic Created', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");
  // WHEN
  new DatadogMonitor.DatadogMonitor(stack, 'MyTestConstruct', {
    query: 'some-query',
    type: 'todo',
    datadogCredentials: {
      apiKey: '',
      applicationKey: ''
    } });
  // THEN
  expectCDK(stack).to(countResources("AWS::SNS::Topic",0));
});
