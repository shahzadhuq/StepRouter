"use strict";

function initRandomUserWizard() {

  let randomUserWizard = null;

  const wizardConfig = {
    stepRouterAnchorId: "random-user-wizard",
    stepRouterCtx: "randomUserWizard"
  };

  randomUserWizard = new StepRouter(wizardConfig);

  // register step
  randomUserWizard.registerStep({
    id: "step1",
    controller: randomStep1Controller,
    callback: {
      "viewAsync": "stepLoader",
      "nextAsync": "next"
    }
  });

  //register step
  randomUserWizard.registerStep({
    id: "step2",
    controller: randomStep2Controller,
    callback: {
      "viewAsync": "stepLoader",
      "previousAsync": "previous"
    }
  });

  // kick off wizard
  randomUserWizard.start();

  window.randomUserWizard = randomUserWizard;
}
