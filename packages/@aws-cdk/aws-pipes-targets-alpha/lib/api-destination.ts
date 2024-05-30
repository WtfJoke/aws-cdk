import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import { HttpParameters } from './http-parameters';

/**
 * Parameters for the EventBridge API destinations target
 */
export interface ApiDestinationParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * Additional parameters when invoking the API destination
   */
  readonly httpParameters?: HttpParameters;
}

/**
 * An EventBridge Pipes target that sends messages to an API Destination.
 */
export class ApiDestination implements ITarget {
  public readonly targetArn: string;

  private readonly apiDestination: events.IApiDestination;
  private readonly inputTemplate?: IInputTransformation;
  private readonly httpParameters: HttpParameters | undefined;

  constructor(apiDestination: events.IApiDestination, parameters: ApiDestinationParameters) {
    this.apiDestination = apiDestination;
    this.targetArn = apiDestination.apiDestinationArn;
    this.inputTemplate = parameters.inputTransformation;
    this.httpParameters = parameters.httpParameters;
  }

  grantPush(grantee: iam.IRole): void {
    grantee.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [this.apiDestination.apiDestinationArn],
      actions: ['events:InvokeApiDestination'],
    }));
  }

  bind(pipe: IPipe): TargetConfig {
    return {
      targetParameters: {
        inputTemplate: this.inputTemplate?.bind(pipe).inputTemplate,
        httpParameters: {
          headerParameters: this.httpParameters?.headers,
          pathParameterValues: this.httpParameters?.pathParameters,
          queryStringParameters: this.httpParameters?.queryParameters,
        },
      },
    };
  }
}
