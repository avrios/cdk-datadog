import '@aws-cdk/assert/jest';
import { Stack } from 'aws-cdk-lib';
import * as DatadogMonitor from '../lib/index';
import { SynthUtils } from "@aws-cdk/assert";

test('Minimal Datadog Monitor Snapshot Test', () => {
    const stack = new Stack();

    // WHEN
    new DatadogMonitor.DatadogMonitor(stack, 'DatadogTestMonitor', {
        query: 'some-query',
        type: 'metric alert',
        datadogCredentials: {
            apiKey: 'some-api-key',
            applicationKey: 'some-app-key'
        }
    });

    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test('Datadog Monitor Can Be Extended With Unsupported Properties', () => {
    const stack = new Stack();
    const criticalThreshold = 111;
    const creatorName = 'some creator';
    const isLocked = true;

    // WHEN
    new DatadogMonitor.DatadogMonitor(stack, 'DatadogTestMonitor', {
        query: 'some-query',
        type: 'metric alert',
        options: {
            thresholds: {
                critical: criticalThreshold
            }
        },
        datadogCredentials: {
            apiKey: 'some-api-key',
            applicationKey: 'some-app-key'
        },
        additionalMonitorParams: {
            Options: {
                Locked: isLocked
            },
            Creator: {
                Name: creatorName
            }
        }
    });

    // THEN
    expect(stack).toHaveResource('Datadog::Monitors::Monitor', {
        // Nested properties can be extended with functionality not yet exposed
        Options: {
            Thresholds: {
                Critical: criticalThreshold
            },
            Locked: isLocked
        },
        // Additional properties are added
        Creator: {
            Name: creatorName
        }
    });
});
