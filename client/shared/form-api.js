// FIXME: refactor this
// credits: Szymon Kosno
// URL: https://medium.com/@skosno/server-error-handing-in-angularjs-forms-c5fd38ccf0fc#.7l6vo58h7

// questa IIFE - Immediate Invoked Function Expression
// mi serve per mantenere un solo oggetto manipulatedForms
// attraverso piu direttive form-api
var manipulatedForms = [
    // {
    //     form: formCtrl,
    //     field: 'nomefield',
    //     code: 'taxCode'
    // }
];

// Questa direttiva controlla un valore nello
function FormApiLink ($window, scope, elm, attrs, ctrl) {
  var formCtrl = ctrl[0];
  var offsetFromTop = elm[0].offsetTop;
    // unless proven wrong by API, the form is valid
  resetForm(formCtrl);

  scope.$watch(attrs.formApi, attachCatch);
    // on formModelController $destroy we remove any tracks
    // from the static manipulatedForms array (it might cause memory leaks!)
  scope.$on('$destroy', cleanFormErrors);

  function attachCatch (newValue, oldValue) {
    if (newValue === oldValue || newValue === null) return;
    if (newValue.catch == null) throw new Error('form-api expects a Promise as it\'s value');
    newValue.catch(promiseCatcher);
  }

  function promiseCatcher (err) {
    if (!angular.isObject(err) && !angular.isArray(err)) throw new Error('service errors should be Object or Array to be handled by form-api');
    var errorObj = (err.constructor == Object ? [err] : err);
    resetForm(formCtrl, true); // calls reset but we ALREADY know that the form is invalid, since the promise failed.
      // for each API error
      // - it memorizes what it's invalidating
      // - invalidates specific ngModelController
    errorObj.forEach(function (formErr) {
        if (!formErr.code) throw new Error('form error needs to have a field called \'code\'');
        var newFormErr = {
            form: formCtrl,
            error: formErr.code
          };
        if (formErr.field) newFormErr.field = formErr.field;
        manipulatedForms.push(newFormErr);

          // if an error is not field-specific, it gets attached to form.$api.$error[name]
        if (formCtrl[formErr.field] == null) return formCtrl.$api.$error[formErr.code] = true;
        formCtrl[formErr.field].$setValidity(formErr.code, false);
      });
    $window.scrollTo(0, offsetFromTop);
  }

  function cleanFormErrors () {
    manipulatedForms.forEach(function (apiForm, index) {
      if (apiForm.form === formCtrl) manipulatedForms.splice(index, 1);
    });
  }
}

function resetForm (form, invalid) {
  form.$api = {
    $error: {},
    $invalid: invalid ? true : false,
    $valid: invalid ? false : true
  };
}

function ApiValidationLink (scope, elm, attrs, ctrl) {
  var modelCtrl = ctrl[0];
  var formCtrl = modelCtrl.$$parentForm;

  modelCtrl.$validators.apiValidate = apiValidator;

  function apiValidator () {
    // read up all the API errors from every form
    manipulatedForms
      .filter(function (apiForm) { // filter by form and modelName
        return (apiForm.form === formCtrl && apiForm.field === modelCtrl.$name);
      })
      // return only the errorName
      .map(function (apiForm) { return apiForm.error; })
      // make it valid as soon as the user changes it
      .forEach(validateFields);

      // this is fake validator, just return true
    return true;
  }

  function validateFields (err) {
    if (modelCtrl.$error[err]) modelCtrl.$setValidity(err, true);
  }
}

app.directive('formApi', function ($window) {
  return {
    restrict: 'A',
    scope: false,
    require: ['form'],
    link: FormApiLink.bind(null, $window)
  };
});

app.directive('apiValidation', function () {
  return {
    restrict: 'A',
    scope: false,
    require: ['^ngModel'],
    link: ApiValidationLink
  };
});
