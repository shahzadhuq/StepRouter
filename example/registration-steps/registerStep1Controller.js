class registerStep1Controller {

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
            <label for="email"><b>Email</b></label>
            <input type="text" placeholder="Enter Email" name="email" required>
          </div>
          <div>
            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" required>
          </div>
          <div>
          <label for="psw-repeat"><b>Repeat Password</b></label>
          <input type="password" placeholder="Repeat Password" name="psw-repeat" required>
          </div>
          <hr/>
          <button onclick="stepRouterCtx.next()">Next</button>
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
      resolve();
    });

    return promise;
  }

}
