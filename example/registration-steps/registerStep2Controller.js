class registerStep2Controller {

  constructor() {
    this.stepId = "step1";

    this.stepTemplate =
    `<style>
    .register-container label {
      display: block;
    }
    .register-container input[type='text'] {
      width: 100%;
    }
    </style>
    <div style="register-container">
     <h1>Fake Register</h1>
      <hr/>
        <form>
          <div>
            <label for="first-name"><b>First Name</b></label>
            <input type="text" placeholder="Enter first name" name="first-name" required>
          </div>
          <div>
          <label for="last-name"><b>Last Name</b></label>
          <input type="text" placeholder="Enter last name" name="last-name" required>
          </div>
          <div>
          <label for="age"><b>Age</b></label>
          <input type="text" placeholder="Enter age" name="age" required>
          </div>
          <hr/>
          <button onclick="stepRouterCtx.previous()">Back</button>
          <button onclick="stepRouterCtx.next()">Submit</button>
        </form>
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
      setTimeout(resolve, 2000);
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

}
