class randomStep2Controller {

  constructor() {
    this.stepId = "step1";

    this.stepTemplate =
    `
    <div><b>Fetched from 'https://randomuser.me/api/'</b></div>
    <hr/>
    <br/>
    <div style="max-width: 400px;text-align: left;">
      {{userData}}
    </div>
    <hr/>
    <button onclick="stepRouterCtx.previous()">previous</button>`;
  }

  stepLoader () {
    const _self = this;

    const promise = new Promise((resolve, reject) => {

      this.httpGet('https://randomuser.me/api/', function(response) {
        if( _self.stepTemplate && _self.stepTemplate.length > 1 ) {
          const finalHTML = _self.stepTemplate.replace("{{userData}}", response);
          resolve(finalHTML);
        } else {
          reject("Step loader could not be produce step View.");
        }
      });
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

  httpGet(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        anHttpRequest.open( "GET", aUrl, true );
        anHttpRequest.send( null );
    };
}
