import { element as $ } from 'angular';

function linkFn (scope, element, attrs, ctrls) {
  const ngModel = ctrls;

  const recaptchaDiv = document.getElementById('recaptcha_widget_div');
  element.append($(recaptchaDiv));

  // recaptcha gets loaded asynchronously, so this interval helps to detect it
  const interval = setInterval(() => {
    const challengeField = document.getElementById('recaptcha_challenge_field');
    if (!challengeField) return;

    clearInterval(interval);

    const responseField = document.getElementById('recaptcha_response_field');

    // attache event listener on response field
    $(responseField).on('change input', (evt) => ngModel.$setViewValue(evt.target.value));

    scope.onChallenge(challengeField.value);
  }, 500);

}

function directive () {
  return {
    require: '^ngModel',
    scope: {
      onChallenge: '<'
    },
    link: linkFn
  };
}

export default directive;
