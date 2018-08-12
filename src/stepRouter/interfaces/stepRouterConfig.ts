/**
 * Drives wizard's core configuration contract
 */
export interface StepRouterConfig {
  // Unique identifier in the DOM where wizard would inject it's content
  stepRouterAnchorId: string;

  // Name of the variable holding reference to the wizard controller instance which would be registered on the 'window' object
  // Example let myWiard = new WizardController();  <-- 'myWizard'
  // Later when each step performs transition activities (like next, previous, skip), this acts as the encapsulating context.
  // Thus, isolating this instance from others on the same page
  stepRouterCtx: string;
}
