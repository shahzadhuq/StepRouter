import { StepRouter } from '../controller/stepRouter';
import { TransitionType } from '../enums/transitionType';


/**
 * Drives step registration contract
 */
export interface StepInfo {
  // Unique identifier
  id: string;

  // Name of class driving the step
  controller: any,

  // Instance of the controller that will be created by the wizard (on-demand)
  ctrlInstance?: any,

  // Async callback(s) on the controller to handle (on-demand) step UI and transition activities
  callback: {
    viewAsync: any,
    nextAsync?:any,
    previousAsync?: any,
    skipAsync?: any
  }

  // Any misceleanous properties that each step wants to track to share across the wizard
  data?: object;
}
