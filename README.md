# CDK Datadog

CDK Datadog is CDK wrapper around the official [Datadog AWS CloudFormation Resources](https://github.com/DataDog/datadog-cloudformation-resources/tree/datadog-monitors-monitor-3.0.0).
CDK Datadog supports the following resource types in Version 3.0.0 (see above):

* Monitors: `Datadog::Monitors::Monitor`

## Usage

In order to use the CDK constructs defined by this library, you must first register the Datadog resource with your CloudFormation registry
by following the [official documentation](https://github.com/DataDog/datadog-cloudformation-resources/tree/datadog-monitors-monitor-3.0.0).

**Note**: CDK Datadog defaults to the EU site. Refer to the interface `DatadogCredentials` in order to use the US site.

### DatadogMonitor

The following example demonstrates a minimal setup for a monitor:

    new DatadogMonitor.DatadogMonitor(stack, 'MyDatadogMonitor', {
        query: 'avg(last_5m):max:aws.sqs.approximate_age_of_oldest_message{queuename:MyQueue} > 100',
        type: 'query alert',
        datadogCredentials: {
            apiKey: '<API_KEY>',
            applicationKey: '<APPLICATION_KEY>'
        }
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

