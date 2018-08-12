class registerStep3Controller {

  constructor() {
    this.stepId = "step1";

    this.stepTemplate =
    `<h1>Fake Register</h1>
      <hr/>
      <div>Your fake registration is complete.</div>
      <div>Hope you enjoyed StepRouter simplicity!</div>
      `;
  }

  stepLoader () {
    const _self = this;

    const promise = new Promise((resolve, reject) => {

      if( _self.stepTemplate && _self.stepTemplate.length > 1 ) {
        resolve(this.stepTemplate);
      } else {
        reject("Step loader could not be produce step View.");
      }

    });

    return promise
  };

}
