class Step1Controller {

  constructor() {
    this.stepId = "step1";

    this.stepTemplate =
    `<div style="text-align: center; padding: 10px 10px 30px 10px;">
      <div class="header"><h1>Step 1</h1></div>
      <hr/>
      <div class="body">step_1: <strong>Body</strong> content</div>
      <hr/>
      <div class="footer">
        <button onclick="stepRouterCtx.next()">Next</button>
        <button onclick="stepRouterCtx.skip()">skip</button>
      </div>
    </div>`;
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

  next () {
    let promise = new Promise((resolve, reject) => {
      console.log("Step 1: next has completed it's operations.  Now ready to transition.");
      resolve();
    });

    return promise;
  }

  previous ()  {
    let promise = new Promise((resolve, reject) => {
      console.log("Step 1: previous has completed it's operations.  Now ready to transition.");
      resolve();
    });

    return promise;
  }

  skip ()  {
    let promise = new Promise((resolve, reject) => {
      console.log("Step 1: skip  has completed it's operations.  Now ready to transition.");
      resolve();
    });

    return promise;
  }

}
