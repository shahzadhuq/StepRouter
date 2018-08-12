
import { StepInfo } from '../interfaces/stepInfo';
import { StepRouterConfig } from '../interfaces/stepRouterConfig';
import { RegistrationResponse } from '../interfaces/stepRegisterResponse';

import { TransitionType } from '../enums/transitionType';

import { StepRouterService } from '../services/stepRouterService';

import { ErrorMessage } from '../constants/errorMessage';

/**
 * This is responsible for all the primary UI and interaction activities related to step orchestration
 */
export class StepRouter {

  // minimal style used internally to show errors, loading progress, last step reached animation
  private stepRouterMasterStyle: string =
    `<style>
    .error-wrapper {
      position: absolute;
      z-index: ;
      top: 1;
      bottom: 0;
      background-color: #B00020;
      color: #fff;
      width: 100%;
      border-radius: 5px
      z-index: 1;
      display: none;
    }

    .loading .step-wrapper {
      display: none;
    }

    .error-wrapper .message {
      padding: 10px 10px;
      white-space: normal;
      word-break: break-word;
      flex: 1 auto;
    }
    .error-wrapper .clear {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      margin-right: 5px;
    }

    .show-error .error-wrapper {
      display: flex;
      align-items: center;
    }

    .loading .step-loader {
      border: 8px solid #f3f3f3;
      border-top: 8px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: stepLoaderAnimation 2s linear infinite;
    }
    @keyframes stepLoaderAnimation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .last-step {
      animation: stepNotFoundAnimation 0.2s 1;
    }

    @keyframes stepNotFoundAnimation {
      0% { transform: translate(1px, 1px) rotate(0deg); }
      10% { transform: translate(-1px, -2px) rotate(-1deg); }
      20% { transform: translate(-3px, 0px) rotate(1deg); }
      30% { transform: translate(3px, 2px) rotate(0deg); }
      40% { transform: translate(1px, -1px) rotate(1deg); }
      50% { transform: translate(-1px, 2px) rotate(-1deg); }
      60% { transform: translate(-3px, 1px) rotate(0deg); }
      70% { transform: translate(3px, 1px) rotate(-1deg); }
      80% { transform: translate(-1px, -1px) rotate(1deg); }
      90% { transform: translate(1px, 2px) rotate(0deg); }
      100% { transform: translate(1px, -2px) rotate(-1deg); }
  }
  </style>`;

  private stepRouterMasterTemplate: string =
    `{{stepRouterMasterStyle}}
    <div class="step-router-wrapper">
      <div class="step-loader"></div>
      <div class="error-wrapper">
        <div class="message"><!-- Error message injected here--></div>
        <button class="clear">clear</button><!-- note: click event would be automatically bound upon wizard initialization -->
      </div>
      <div class="step-wrapper"><!-- Step content will be injected here --></div>
    </div>`;


  // Element attribute names (id/class)
  private loadingClassName = "loading";
  private showErrorClassName = "show-error";
  private stepRouterWrapperClassName = "step-router-wrapper";
  private stepWrapperClassName = "step-wrapper";
  private errorMessageClassName = "message";
  private clearErrorMessageClassName = "clear";
  private lastStepClassName = "last-step";

  //private steps: Array<StepInfo>;
  private stepRouterAnchorElement: any = null; // Where step router content is anchored (inject into the DOM)
  private stepRouterWrapperElement: any = null; // Reference to the step router container element inside the anchor
  private stepWrapperElement: any = null; // Reference to the step content container element where each step's content would be injected
  private errorMsgElement: any = null; // Reference to the error message element where error messages would be injected


  private _stepRouterService: StepRouterService = {} as StepRouterService;
  private stepRouterConfig: StepRouterConfig = {} as StepRouterConfig;


  // Each step loaded will need to have the correct Step Router context attached to it
  // Upon loading a step, we use this expression to replace token placeholder with correct context
  private stepViewBindingReplacement = new RegExp("stepRouterCtx", "gi");

  // Represents the step currently being shown
  private currentStep: StepInfo = {} as StepInfo;

  constructor(_stepRouterConfig: StepRouterConfig) {

      // Ensure the config has provided all the required information
      const isStepRouterConfigValid = this.validateStepRouterConfig(_stepRouterConfig);
      if(!isStepRouterConfigValid) {
        return;
      }

      this.stepRouterConfig = _stepRouterConfig;

       // Internal service singleton
       // note: DI would be better way to do this but no system in place for DI
       this._stepRouterService = new StepRouterService();
  }

  /**
   * Loads the step wizard's core html structure into the DOM and
   * save references to step wizard's DOM elements for subsequent updates
   */
  public start() {

    try {

      this.setupStepRouterInternals();

      if(this._stepRouterService.steps.length === 0) {
        this.stepRouterAnchorElement.innerHTML = ErrorMessage.step_register_noneRegistered;
      }

      // Step content orchestration
      const stepId = this._stepRouterService.steps.length > 0 ? this._stepRouterService.steps[0].id : "";
      const step = this._stepRouterService.findStep(stepId);

      this.transitionStep(step);

      this.bindInternalClickEvents();

     } catch (ex) {
      this.handleError(ex);
    }
  }

  /**
   * Click events for wizard internal usage (nothing to do with any of the steps)
   */
  private bindInternalClickEvents(): void {
    // Clear error message event
    let clearErrorMsgElement = this.stepRouterWrapperElement.getElementsByClassName(this.clearErrorMessageClassName);

    if (clearErrorMsgElement[0]) {
      clearErrorMsgElement[0].addEventListener("click", this.clearErrorMessage.bind(this));
    }

  }

  /**
   * Prevent UI interaction
   */
  private blockUI() {
    this.stepRouterWrapperElement.classList.add(this.loadingClassName);
  }

  /**
   * Allow UI interaction; undo what block UI does
   */
  private unblockUI() {
    this.stepRouterWrapperElement.classList.remove(this.loadingClassName);
  }

  private handleError(error: Error): void {
    this.showErrorMessage(error);
  }

  /**
   * Visual queue that last step is reached.
   * Note: first step and last step are both treated as end of road
   */
  private handleEndOfRoad(): void {
    this.stepRouterWrapperElement.classList.add(this.lastStepClassName);

    setTimeout(() => {
      this.stepRouterWrapperElement.classList.remove(this.lastStepClassName);
    }, 500);
  }

  private showErrorMessage(error: Error): void {
    if (this.errorMsgElement) {
      this.errorMsgElement.innerHTML = `Sorry, an error has occured: ${error.message}`;
      this.stepRouterWrapperElement.classList.add(this.showErrorClassName);
    } else {
      console.error("[Step Router]: sorry, an error has occured" + error.message);
    }
  }

  private clearErrorMessage(): void {
    this.stepRouterWrapperElement.classList.remove(this.showErrorClassName);
    this.errorMsgElement.innerHTML = "";
  }

  /**
   * Performs step registration
   * @param stepConfig configuration describing step information to register
   */
  public registerStep(stepConfig: StepInfo): Promise<RegistrationResponse> {

    let promise = new Promise<RegistrationResponse>((resolve, reject) => {

      let response: RegistrationResponse = {
        isRegistered: true,
        error: new Error()
      };

      try {

        // Ensure step registration pre-requisites are met
        this.validateStepRegistrationConfig(stepConfig);

        // Prepare step registration
        const newStep: StepInfo = {
          id: stepConfig.id,
          controller: stepConfig.controller,
          ctrlInstance: null,
          callback: stepConfig.callback,
          data: stepConfig
        }

        // Register the step
        this._stepRouterService.addStep(newStep);

        resolve(response);

      } catch (ex) {

        response.isRegistered = false;
        response.error = ex;

        this.handleError(ex);

        reject(response);
      }

    });


    return promise;
  }

  /**
   * Display the UI for the step
   * @param stepContent Step's UI (HTML)
   */
  private loadStepView(stepContent: string): void {
    this.stepWrapperElement.innerHTML = stepContent;
  }


  /**
   * Helps navigate the user to the destination step
   * @param destinationStep Destination step
   */
  private transitionStep(destinationStep: StepInfo): void {

    // Load step controller
    destinationStep.ctrlInstance = this.getStepCtx(destinationStep);

    // Update current step context
    this.currentStep = destinationStep;

    // Load destination step view (UI)
    this._stepRouterService.getStepView(destinationStep)
      .then((result) => {
        // For transition actions requested in the step's UI, bind it to the proper wizard context
        result = result.replace(this.stepViewBindingReplacement, `${this.stepRouterConfig.stepRouterCtx}`);

        this.loadStepView(result);
      })
      .catch((result) => {
        this.loadStepView(result);
      });
  }

  public next(): void {

    this.blockUI();

    const stepNextCallback = this.currentStep.ctrlInstance[this.currentStep.callback.nextAsync]() as Promise<string>;

    // Once current step is done with it's operations then transition to the next step
    stepNextCallback
      .then((result) => {
        // Determine the next step
        const destinationStep = this._stepRouterService.findStep(this.currentStep.id, TransitionType.Next);

         // Temp last step handler
        // ToDo: Add more reporting around last/first step and enable/disable transition buttons
        if(!destinationStep) {
          this.handleEndOfRoad();
        } else {
          this.transitionStep(destinationStep);
        }

      })
      .catch((result) => {
        this.loadStepView(result);
      })
      .finally(() => {
        this.unblockUI();
      });
  }

  public previous(): void {

    this.blockUI();

    const stepPreviousCallback = this.currentStep.ctrlInstance[this.currentStep.callback.previousAsync]() as Promise<string>;

     // Once current step is done with it's operations then transition to the next step
    stepPreviousCallback
      .then((result) => {
        // Determine the previous step
        const destinationStep = this._stepRouterService.findStep(this.currentStep.id, TransitionType.Previous);

        // Temp last step handler
        // ToDo: Add more reporting around last/first step and enable/disable transition buttons
        if(!destinationStep) {
          this.handleEndOfRoad();
        } else {
          this.transitionStep(destinationStep);
        }

      })
      .catch((result) => {
        this.loadStepView(result);
      })
      .finally(() => {
        this.unblockUI();
      });
  }

  public skip(): void {

    this.blockUI();

    const stepSkipCallback = this.currentStep.ctrlInstance[this.currentStep.callback.skipAsync]() as Promise<string>;

     // Once current step is done with it's operations then transition to the next step
    stepSkipCallback
      .then((result) => {
        // Determine the next step
        const destinationStep = this._stepRouterService.findStep(this.currentStep.id, TransitionType.Skip);

         // Temp last step handler
        // ToDo: Add more reporting around last/first step and enable/disable transition buttons
        if(!destinationStep) {
          this.handleEndOfRoad();
        } else {
          this.transitionStep(destinationStep);
        }

      })
      .catch((result) => {
        this.loadStepView(result);
      })
      .finally(() => {
        this.unblockUI();
      });
  }

  // Helpers

  /**
   * Compose step router UI and get hold of other elements for later use
   */
  private setupStepRouterInternals(): void {

    // Lookup the anchor point
    this.stepRouterAnchorElement = document.getElementById(this.stepRouterConfig.stepRouterAnchorId) as HTMLElement;

    if(!this.stepRouterAnchorElement) {
      throw new Error(ErrorMessage.stepRouter_anchor_wizardElementNotFound.replace("", this.stepRouterConfig.stepRouterAnchorId));
    }

    // Compose step wizard initial Html structure
    let stepRouterHtml = this.stepRouterMasterTemplate.replace("{{stepRouterMasterStyle}}", this.stepRouterMasterStyle);

    // Inject step wizard Html structure into the anchor
    this.stepRouterAnchorElement.innerHTML = stepRouterHtml;

    // Save reference to proper inner anchors for future manipulation
    this.stepRouterWrapperElement = this.stepRouterAnchorElement.getElementsByClassName(this.stepRouterWrapperClassName)[0];
    this.stepWrapperElement = this.stepRouterAnchorElement.getElementsByClassName(this.stepWrapperClassName)[0];
    this.errorMsgElement = this.stepRouterAnchorElement.getElementsByClassName(this.errorMessageClassName)[0];
  }

  /**
   * Set of rules to satisfy to ensure wizard can work correctly
   * @param routerConfig step wizard's core settings
   */
  private validateStepRouterConfig(routerConfig: StepRouterConfig): boolean {
    // note: Since we can't rely on presence of an anchorId at this stage; therefore,
    // console window seems like reasonable alternative to show an errors versus crashing the page

    let response = true;

    // Rule #0: ensure wizard config is provided
    if (!routerConfig) {
      response = false;
      console.error(ErrorMessage.stepRouter_config_undefined);

      return response;
    }

    // Rule #1: ensure we have the DOM anchor where we will be injecting the UI
    if (!routerConfig.stepRouterAnchorId || routerConfig.stepRouterAnchorId.length === 0) {
      response = false;
      console.error(ErrorMessage.stepRouter_config_anchorIdNotFound);

      return response;
    }

    // Rule #2: ensure we've the context holding reference to this wizard's instance
    if (!routerConfig.stepRouterCtx || routerConfig.stepRouterCtx.length === 0) {
      response = false;
      console.error(ErrorMessage.stepRouter_config_ctxPropMissing);

      return response;
    }

    return response;
  }

  /**
   * Set of rules to satisfy to ensure wizard can perform it's activities
   * @param stepConfig information about the step to register
   */
  private validateStepRegistrationConfig(stepConfig: StepInfo): boolean {

    // Rule #1: ensure primary key for the step is provided
    if (!stepConfig.id || stepConfig.id.length === 0) {
      throw new Error(ErrorMessage.step_register_stepIdMissing);
    }

    // Rule #2: ensure 'id' is unique (hasn't been registered already)
    const step = this._stepRouterService.steps.filter(e => e.id === stepConfig.id);
    if (step.length !== 0) {
      throw new Error(ErrorMessage.step_register_duplicateId.replace("{{stepId}}", stepConfig.id));
    }

    // Rule #3: ensure step's controller has been provided
    if (!stepConfig.controller || typeof (stepConfig.controller) === "string") {
      throw new Error(ErrorMessage.step_register_controllerdMissing);
    }

    // Rule #4: ensure step's view is available
    if (!stepConfig.callback.viewAsync) {
      throw new Error(ErrorMessage.step_register_stepViewMissing);
    }

    return true;
  }

  /**
  * Get or create context for the specified step
  * @param step Step whose context to get/create
  */
  private getStepCtx(step: StepInfo): Function {

    let response: Function;

    if (step.ctrlInstance) {
      response = step.ctrlInstance;
    } else {
      response = new step.controller();
    }
    return response;
  }
}
