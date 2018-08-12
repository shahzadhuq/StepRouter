
import { StepRouterActions } from '../interfaces/stepRouterActions';
import { StepInfo } from '../interfaces/stepInfo';
import { RegistrationResponse } from '../interfaces/stepRegisterResponse';

import { TransitionType } from '../enums/transitionType';

import { ErrorMessage } from '../constants/errorMessage';

/**
 * Service to manage the core functions like tracking steps, help fetch step UI etc.
 */
export class StepRouterService implements StepRouterActions {

  private _steps: Array<StepInfo>;

  constructor() {
    this._steps = [];
  }

  /**
   * Registered steps
   */
  get steps(): Array<StepInfo> {
    return this._steps;
  }

  /**
   * Help register the step
   * @param step step to register
   */
  public addStep(step: StepInfo): void {
    this._steps.push(step);
  }

  /**
   * Finds the registered step with respect to the transition type where applicable
   * @param stepConfig information about the step to register
   */
  public findStep(stepId: string, transitionType?: TransitionType): StepInfo {
    let response: StepInfo;

    // Lookup the step location
    let resultIndex = this._steps.map(s => s.id).indexOf(stepId);

    if (resultIndex !== -1) {

      switch (transitionType) {
        case TransitionType.Next:
        case TransitionType.Skip:
          resultIndex = resultIndex + 1;
          break;

        case TransitionType.Previous:
          resultIndex = resultIndex - 1;
          break;
      }

      response = this._steps[resultIndex] || null;

    } else {
      throw new Error(ErrorMessage.step_find_notFound.replace("{{stepId}}", stepId));
    }

    return response;
  }

  /**
   * Get UI (HTML) for the step from the registered callback
   * @param step step whose UI to fetch
   */
  getStepView(step: StepInfo): Promise<string> {

    // Pre-requisite #1
    if (typeof(step.ctrlInstance[step.callback.viewAsync]) !== "function") {
      throw new Error(ErrorMessage.step_view_callbackNotFunction);
    }

    const promise = new Promise<string>((resolve, reject) => {

      step.ctrlInstance[step.callback.viewAsync]()
        .then((result: string) => {
          resolve(result);
        })
        .catch((result: string) => {
          reject(result);
        });

    });

    return promise;
  }
}
