"use strict";

function initRegistrationWizard() {

  let registrationWizard = null;

  const wizardConfig = {
    stepRouterAnchorId: "registration-wizard",
    stepRouterCtx: "registrationWizard"
  };

  registrationWizard = new StepRouter(wizardConfig);

  // register step
  registrationWizard.registerStep({
    id: "step1",
    controller: registerStep1Controller,
    callback: {
      "viewAsync": "stepLoader",
      "nextAsync": "next"
    }
  });

  //register step
  registrationWizard.registerStep({
    id: "step2",
    controller: registerStep2Controller,
    callback: {
      "viewAsync": "stepLoader",
      "nextAsync": "next",
      "previousAsync": "previous"
    }
  });

   //register step
   registrationWizard.registerStep({
    id: "step3",
    controller: registerStep3Controller,
    callback: {
      "viewAsync": "stepLoader",
      "nextAsync": "next",
      "previousAsync": "previous"
    }
  });

  // kick off wizard
  registrationWizard.start();

  window.registrationWizard = registrationWizard;
}
