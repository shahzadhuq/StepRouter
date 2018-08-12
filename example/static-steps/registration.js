
"use strict";

function initStaticnWizard() {

  let staticWizard = null;

  const wizardConfig = {
    stepRouterAnchorId: "static-wizard",
    stepRouterCtx: "staticWizard"
  };

  staticWizard = new StepRouter(wizardConfig);

  // register step
  staticWizard.registerStep({
    id: "step1",
    controller: Step1Controller,
    callback: {
      "viewAsync": "stepLoader",
      "nextAsync": "next",
      "previousAsync": "previous",
      "skipAsync": "skip"
    }
  });

  // register step
  staticWizard.registerStep({
    id: "step2",
    controller: Step2Controller,
    callback: {
      "viewAsync": "stepLoader",
      "nextAsync": "next",
      "previousAsync": "previous",
      "skipAsync": "skip"
    }
  });

  // kick off wizard
  staticWizard.start();

  window.staticWizard = staticWizard;
  }
