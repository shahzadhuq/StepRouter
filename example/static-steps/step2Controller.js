class Step2Controller {

  constructor() {
    this.stepId = "step2";

    this.stepTemplate =
    `<div style="text-align: center; padding: 10px 10px 30px 10px;">
      <div class="header"><h1>Step 2</h1></div>
      <hr/>
      <div class="body">step_2: <strong>Body</strong> content</div>
      <hr/>
      <div class="footer">
        <button id="wizard-previous" onclick="stepRouterCtx.previous()">Previous</button>
      </div>
    </div>`;
  }

  stepLoader () {
    const _self = this;

    const promise = new Promise((resolve, reject) => {

      if( _self.stepTemplate && _self.stepTemplate.length > 1 ) {
        resolve(this.stepTemplate);
      } else {
        reject("");
      }

    });

    return promise
  };

  next () {
    let promise = new Promise((resolve, reject) => {
      console.log("Step 2: next has completed it's operations.  Now ready to transition.");
      resolve();
    });

    return promise;
  }

  previous ()  {
    let promise = new Promise((resolve, reject) => {
      console.log("Step 2: previous has completed it's operations.  Now ready to transition.");
      resolve();
    });

    return promise;
  }

  skip ()  {
    let promise = new Promise((resolve, reject) => {
      console.log("Step 2: skip has completed it's operations.  Now ready to transition.");
      resolve();
    });

    return promise;
  }

}
