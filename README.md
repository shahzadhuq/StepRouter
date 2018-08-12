# Introduction
Let's say you're implementing a process like 'user registration' broken into multiple UI components (steps).  A seemingly trivial but important part is ability for user to navigation back/forth among these steps. More often this navigation logic gets tightly coupled with the steps at hand and loses much of it's reusability for rest of our project.  We end up writing such navigation logic over and over again.

What if you have a super light library which performs the navigation for you and let's you focus your energy on the individual steps where most of the business logic lives!

Let me know introduce you to library called __**StepRouter**__.  It is designed with following goals in mind:

- Be agnostic to how steps are built (HTML/CSS/JS), so it can be resued across projects
- Focus on one thing: help user navigate back/forth among the steps
- Be cautions about minimizing StepRouter dependency pushed down to any step

You can find more details in the sections below.

# Demo
Checkout the [Live Demos](https://steprouter.azurewebsites.net/) showcasing different type of processes whose navigation is managed by __**StepRouter**__ library.

# How to use it?
In just three steps you can offload your user navigation needs.

1. Add the ```step-router.js``` reference in your master page (available in this repository under 'dist' folder).
  > FYI: This dist is built targeting ES6 (using native Promise).

3. Configure an instance of the Step Router.

```
const myStepRouterCtx = new StepRouter({
  stepRouterAnchorId: "my-target-DOM-id",
  stepRouterCtx: "myStepRouterCtx"
});
```

3. Register your step and start the step router

```
  myStepRouterCtx.registerStep({
    id: "step1", // required
    controller: step1Controller, // required
    callback: {
      "viewAsync": "myStepViewFn", // required
      "nextAsync": "myStepNextFn", // optional
      "previousAsync": "myStepPrevFn", // optional
      "skipAsync": "myStepSkipFn"  // optional
    }
  });

  myStepRouterCtx.start();
```

# StepRouter Highlevel Inner Workings

To better undrestand how StepRouter works, let's walkthrough the flow below:

## Step Configuration Details

1. Each registered step will be lazy loaded on-demand; when step is needed to be shown
2. Each step configuration must adhere to the following:
- Step must have a unique Id, acting as the primary key
- Controller name should be pointing to an instantiable class/function name that has already been loaded into the Document Object Model
- All callbacks (viewAsync, nextAsync previousAsync, and skipAsync) must be return a ```Promise```
- StepRouter responds to next/previous/skip action as long as they are registered properly in your step.  For example, action 'next' would need to be specified as ```onclick="stepRouterCtx.next()"```.

## Step Router Details

Upon loading a step, StepRouter does the following:

- Look up the step by it's 'id'
- Create/use previously created instance of the controller registered with the step
- Using step 'viewAsync' callback, fetch UI and replace all instance of 'stepRouterCtx' with the value passed during the the StepRouter configuration.  For example, ```onclick="stepRouterCtx.next()"``` --final HTML--> ```onclick="myStepRouterCtx.next()"```

  Now let's say, the user clicked 'Next' button in the step.  Then following series of events will take place:
  - 'Next' action will be called on the StepRouter
  - From the current step being tracked, StepRouter will look up the 'nextAsync' registered and await it's result (Promise response)
  - If Promise is fulfilled, StepRouter will determine the next step with respect to current step and then navigate the user
  - If Promise is rejected, then StepRouter will simply show the reason returned by step

# Step Router Settings

Following tables show various settings and actions available for the KissWizard.

| Category        | Name         | Required? | Type | Description  |
|-------------|-------------|:-----:|:-----:| -----|
| Styles | .wizard-wrapper | n/a | n/a | FYI: This is the most outer wrapper for the wizard
| Styles | .step-loader | n/a | n/a | FYI: This controls the styling for the spinner shown
| Styles | .error-wrapper | n/a | n/a | FYI: Manages styling for the error message and clear button
| Styles | .error-wrapper | n/a | n/a | FYI: Manages styling for the error message and clear button
| Styles | .error-wrapper .message | n/a | n/a | FYI: styling for the error message text
| Styles | .error-wrapper .clear | n/a | n/a | FYI: styling for the error message clear button
| Styles | .step-wrapper | n/a | n/a | FYI: styling for the wrapper containing your set's UI
| StepRouter config | wizardAnchorId | Yes | string | DOM element 'id' where wizard will inject the UI
| StepRouter config | stepRouterCtx  | Yes | string | Variable that holds reference to the 'NEW' StepRouter instance and available under the 'window' object
| Step config | id  | Yes | string | Acts as the primary key for the registered step; must be unique
| Step config | controller  | Yes | class | Name of an instantiable class driving the step and it's callbacks. *__Note__*, this is not a plain class name as string but rather a function that is ready to be loaded ('new' keyword ready).
| Step config | ctrlInstance  | No | class | This will hold 'NEW' instance of the controller.  *__Note__*, StepRouter will instantiate controller on-demand (once) but technically one could provide an instance of the controller and StepRouter will provided instance instead of creating a new one.
| Step config | callback  | Yes | object | An object that contains the various callbacks
| Step config | callback.view  | Yes | string | An Async method available on the controller that will be called to fetch step's UI; must implement Promise
| Step config | callback.next  | No | string | An Async method available on the controller that is called when 'next' is requested via the UI; must implement Promise
| Step config | callback.previous  | No | string | An Async method available on the controller that is called when 'previous' is requested via the UI; must implement Promise
| Step config | callback.skip  | No | string | An Async method available on the controller that is called when 'skip' is requested via the UI; must implement Promise

# Actions

| Category        | Name         | Required? | Type | Description  |
|-------------|-------------|:-----:|:-----:| -----|
| StepRouter | start | Yes | method | Starts the wizard: shows the first step
| StepRouter | registerStep | Yes | method | Use this to register a new step.  __**Note**__ Steps are shows in the order they are registered.

# Error Messages

```
ErrorMessage = {
  wizard_config_undefined: "[Wizard]: wizard cannot be instantiated becuase configuration is missing/undefined.",
  wizard_config_anchorIdNotFound: "[Wizard]: cannot configure wizard becuase required property 'wizardAnchorId' is missing.",
  wizard_config_instanceNameNotFound: "[Wizard]: cannot configure wizard becuase required property 'wizardInstanceName' is missing.",
  wizard_anchor_wizardElementNotFound: "[Wizard]: cannot configure wizard becuase specified wizard anchor id '{{wizardAnchorId}}' is not found in the DOM.",
  step_register_noneRegistered: "It's lonley here, there are not no steps registered.",
  step_register_stepIdMissing : "[Step]: cannot register step because required property 'id' is missing",
  step_register_duplicateId : "[Step]: '{{stepId}}' cannot be registered because it's registered already.  Step 'id' must be unique.",
  step_register_controllerdMissing : "[Step]: cannot register step because required property 'controller' is either missing or defined as string",
  step_register_stepViewMissing : "[Step]: cannot register step because required property 'viewCallback' is missing",
  step_find_notFound : "[Step]: unable to find step identified as '{{stepId}}'",
  step_view_notFound : "[Step]: unable to fetch step view (HTML) because '{{stepId}}' step is undefined",
  step_view_callbackNotFunction : "[Step]: unable to fetch step view (HTML) because '{{stepId}}' view callback is Not a function"
}
```
