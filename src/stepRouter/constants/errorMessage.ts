export const ErrorMessage = {
  stepRouter_config_undefined: "[Step Router]: Step Router cannot be instantiated becuase required configuration is missing (stepRouterAnchorId and stepRouterCtx).",
  stepRouter_config_anchorIdNotFound: "[Step Router]: cannot configure Step Router becuase required property 'stepRouterAnchorId' is missing.",
  stepRouter_config_ctxPropMissing: "[Step Router]: cannot configure Step Router becuase required property 'stepRouterCtx' is missing.",
  stepRouter_anchor_wizardElementNotFound: "[Step Router]: cannot configure Step Router becuase specified Step Router anchor id '{{wizardAnchorId}}' is not found in the DOM.",
  step_register_noneRegistered: "It's lonley here, there are not no steps registered.",
  step_register_stepIdMissing : "[Step]: cannot register step because required property 'id' is missing",
  step_register_duplicateId : "[Step]: '{{stepId}}' cannot be registered because it's registered already.  Step 'id' must be unique.",
  step_register_controllerdMissing : "[Step]: cannot register step because required property 'controller' is either missing or defined as string",
  step_register_stepViewMissing : "[Step]: cannot register step because required property 'viewCallback' is missing",
  step_find_notFound : "[Step]: unable to find step identified as '{{stepId}}'",
  step_view_notFound : "[Step]: unable to fetch step view (HTML) because '{{stepId}}' step is undefined",
  step_view_callbackNotFunction : "[Step]: unable to fetch step view (HTML) because '{{stepId}}' view callback is Not a function"
}
