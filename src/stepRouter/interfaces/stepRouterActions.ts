import { RegistrationResponse } from './stepRegisterResponse';
import { StepInfo } from './stepInfo';
import { TransitionType } from '../enums/transitionType';

/**
 * Drives the wizard service core functionality contract
 */
export interface StepRouterActions {

  /**
   * Registered steps
   */
  steps: Array<StepInfo>;

  addStep(step: StepInfo): void;

   /**
   * Finds the registered step with respect to the transition type where applicable
   * @param stepConfig information about the step to register
   */
  findStep(stepId: string, transitionType?: TransitionType): StepInfo

   /**
   * Gets the UI (HTML) for the step
   * @param StepInfo configuration describing step information to register
   */
  getStepView(step: StepInfo): Promise<string>;

  /**
   * With respect to the specified step, navigates the wizard to the next step
   * @param stepId Identifier for the step that will be used to determine the next step
   */
  // next(stepId: string): void;

  // /**
  //  * With respect to the specified step, navigates the wizard to the previous step
  //  * @param stepId Identifier for the step that will be used to determine the previous step
  //  */
  // previous(stepId: string): void;

  // /**
  //  * With respect to the specified step, navigates the wizard to the next step
  //  * @param stepId Identifier for the step that will be used to determine the next step
  //  */
  // skip(stepId: string): void;
}
