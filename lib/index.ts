import { Construct } from 'constructs';
import { CfnResource } from 'aws-cdk-lib';
import * as _ from 'lodash';

/**
 * Selectively exposed based on
 * https://github.com/DataDog/datadog-cloudformation-resources/blob/datadog-monitors-monitor-4.7.1/datadog-monitors-monitor-handler/datadog-monitors-monitor.json
 */
export interface DatadogMonitorProps {
    /**
     * The type of the monitor
     */
    readonly type: 'audit alert' | 'composite' | 'event alert' | 'event-v2 alert' | 'log alert' | 'metric alert' | 'process alert' | 'query alert' |
        'service check' | 'synthetics alert' | 'trace-analytics alert' | 'slo alert' | 'rum alert' | 'ci-pipelines alert' | 'error-tracking alert' |
        'ci-tests alert';

    /**
     * The monitor query
     */
    readonly query: string;

    /**
     * Name of the monitor
     */
    readonly name?: string;

    /**
     * Tags associated with the monitor
     */
    readonly tags?: Array<string>;

    /**
     * The monitor options
     */
    readonly options?: DatadogMonitorOptions;

    /**
     * A message to include with notifications for the monitor
     */
    readonly message?: string

    /**
     * Additional parameters to pass through to the underlying CloudFormation template.
     * Allows for defining parameters that have not been exposed (yet).
     * Please note that the params will need to follow PascalCase, as they are CloudFormation identifiers that are
     * passed onward verbatim.
     */
    readonly additionalMonitorParams?: {
        [key: string]: any;
    };
}

export interface DatadogMonitorOptions {
    /**
     * The threshold definitions
     */
    readonly thresholds?: DatadogMonitorThresholds;

    /**
     * Controls how groups or monitors are treated if an evaluation does not return any data points.
     * 
     * The default option results in different behavior depending on the monitor query type.
     * For monitors using Count queries, an empty monitor evaluation is treated as 0 and is compared to the threshold conditions.
     * For monitors using any query type other than Count, for example Gauge, Measure, or Rate, the monitor shows the last known status.
     * 
     * This option is only available for APM Trace Analytics, Audit Trail, CI, Error Tracking, Event, Logs, and RUM monitors.
     */
    readonly onMissingData?: 'default' | 'show_no_data' | 'show_and_notify_no_data' | 'resolve';
}

export interface DatadogMonitorThresholds {
    /**
     * Threshold value for triggering an alert
     */
    readonly critical: number;

    /**
     * Threshold value for recovering from an alert state
     */
    readonly criticalRecovery?: number;

    /**
     * Threshold value for recovering from an alert state
     */
    readonly ok?: number;

    /**
     * Threshold value for triggering a warning
     */
    readonly warning?: number;

    /**
     * Threshold value for recovering from a warning state
     */
    readonly warningRecovery?: number;
}

export class DatadogMonitor extends Construct {
    constructor(scope: Construct, id: string, props: DatadogMonitorProps) {
        super(scope, id);
        this.createMonitor(id, props);
    }

    private createMonitor(id: string, props: DatadogMonitorProps): CfnResource {
        return new CfnResource(this, id, {
            type: 'Datadog::Monitors::Monitor',
            properties:  _.merge({
                    // Note the (left-hand) PascalCase here! These are CloudFormation identifiers.
                    Type: props.type,
                    Query: props.query,
                    Name: props.name,
                    Tags: props.tags,
                    Message: props.message,
                    Options: props.options ? {
                        Thresholds: {
                            Ok: props.options?.thresholds?.ok,
                            Critical: props.options?.thresholds?.critical,
                            CriticalRecovery: props.options?.thresholds?.criticalRecovery,
                            Warning: props.options?.thresholds?.warning,
                            WarningRecovery: props.options?.thresholds?.warningRecovery,
                        },
                        OnMissingData: props.options?.onMissingData,
                    } : undefined
                },
                props.additionalMonitorParams
            )
        });
    }
}
