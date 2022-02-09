import { Construct } from 'constructs';
import { CfnResource } from 'aws-cdk-lib';
import * as _ from 'lodash';

/**
 * Selectively exposed based on
 * https://github.com/DataDog/datadog-cloudformation-resources/blob/datadog-monitors-monitor-3.0.0/datadog-monitors-monitor-handler/datadog-monitors-monitor.json
 */
export interface DatadogMonitorProps {
    /**
     * The type of the monitor
     */
    readonly type: 'composite' | 'event alert' | 'log alert' | 'metric alert' | 'process alert' | 'query alert' |
        'service check' | 'synthetics alert' | 'trace-analytics aler';

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
     * Credentials for the Datadog API
     */
    readonly datadogCredentials: DatadogCredentials;

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

export interface DatadogCredentials {
    /**
     * Datadog API key
     */
    readonly apiKey: string;

    /**
     * Datadog application key
     */
    readonly applicationKey: string;

    /**
     * Datadog API URL.
     * Caution, we default to https://api.datadoghq.eu, use https://api.datadoghq.com for US accounts.
     */
    readonly apiUrl?: string;
}

export class DatadogMonitor extends Construct {
    static readonly DEFAULT_API_URL = 'https://api.datadoghq.eu';

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
                        }
                    } : undefined,
                    DatadogCredentials: {
                        ApiKey: props.datadogCredentials.apiKey,
                        ApplicationKey: props.datadogCredentials.applicationKey,
                        ApiURL: props.datadogCredentials.apiUrl ? props.datadogCredentials.apiUrl : DatadogMonitor.DEFAULT_API_URL
                    }
                },
                props.additionalMonitorParams
            )
        });
    }
}
