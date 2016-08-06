// FIXME: refactor this
// credits: Szymon Kosno
// URL: https://medium.com/@skosno/server-error-handing-in-angularjs-forms-c5fd38ccf0fc#.7l6vo58h7
import angular from 'angular';

const manipulatedForms = [
    // {
    //     form: formCtrl,
    //     field: 'fieldname',
    //     code: 'taxCode'
    // }
];

function formApiLink ($window, scope, elm, attrs, ctrl) {
  const formCtrl = ctrl[0];
  const offsetFromTop = elm[0].offsetTop;
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
    const errorObj = (err.constructor == Object ? [err] : err);
    resetForm(formCtrl, true); // calls reset but we ALREADY know that the form is invalid, since the promise failed.
      // for each API error
      // - it memorizes what it's invalidating
      // - invalidates specific ngModelController
    errorObj.forEach(function (formErr) {
      if (!formErr.code) throw new Error('form error needs to have a field called \'code\'');
      const newFormErr = {
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

function apiValidationLink (scope, elm, attrs, ctrl) {
  const modelCtrl = ctrl[0];
  const formCtrl = modelCtrl.$$parentForm;

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

/* @ngInject */
function formApi ($window) {
  return {
    restrict: 'A',
    scope: false,
    require: ['form'],
    link: formApiLink.bind(null, $window)
  };
}

function apiValidation () {
  return {
    restrict: 'A',
    scope: false,
    require: ['^ngModel'],
    link: apiValidationLink
  };
}

export { apiValidation, formApi };
