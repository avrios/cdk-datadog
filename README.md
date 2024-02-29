# CDK Datadog

CDK Datadog is a CDK wrapper around the official [Datadog AWS CloudFormation Resources](https://github.com/DataDog/datadog-cloudformation-resources/tree/datadog-monitors-monitor-4.7.1). CDK Datadog supports the following resource types in Version 4.7.1 (see above):

* Monitors: `Datadog::Monitors::Monitor`

Note: Version 4 of Datadog AWS CloudFormation Resouces is not backwards compatible. If you're stuck with version 3.x, use version 1.0.1 of CDK Datadog.

## Usage

In order to use the CDK constructs defined by this library, you must first register the Datadog resource with your CloudFormation registry
by following the [official documentation](https://github.com/DataDog/datadog-cloudformation-resources/tree/datadog-monitors-monitor-4.7.1).

After enabling the extension, you need to configure it (follow the official documenation). At least you need to configure "DatadogCredentials". 

### DatadogMonitor

The following example demonstrates a minimal setup for a monitor:

    new DatadogMonitor.DatadogMonitor(stack, 'MyDatadogMonitor', {
        query: 'avg(last_5m):max:aws.sqs.approximate_age_of_oldest_message{queuename:MyQueue} > 100',
        type: 'query alert',
    });

Refer to the interface `DatadogMonitorProps` in order to explore the properties that have been exposed.

In case of unsupported properties, provide them manually as follows:.

    additionalMonitorParams: {
        Options: {
            Locked: true
        },
        Creator: {
            Name: 'Marco'
        }
    }

Note the use of PascalCase, as these are CloudFormation identifiers that are passed onward verbatim.

## Build

 * `npm run build`   compile typescript to js
 * `npm run test`    perform the jest unit tests
 * `npm outdated`    find outdated npm dependencies

## Testing Changes Locally

An easy way of testing new functionality is to manually package the library:

1. Change the version in `package.json` and run `npm install`
2. Run `npm pack`, thereby packaging the changes in a tarball
3. In the service using cdk-datadog, run `npm install <path to tarball>`
