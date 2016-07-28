import { element as $ } from 'angular';

function linkFn (scope, element, attrs, ctrls) {
  console.log(this);
  const recaptchaDiv = document.getElementById('recaptcha_widget_div');
  element.append($(recaptchaDiv));

  const interval = setInterval(() => {
    const challengeField = document.getElementById('recaptcha_challenge_field');
    if (!challengeField) return;

    clearInterval(interval);

    console.log('found da recaptcha!', challengeField.value);
  }, 500);

  // function to be called when challenge is detected
  // onChallenge

  // recaptcha value goes into an ng-model
}

export default function () {
  return {
    restrict: 'E',
    link: linkFn
  };
}

//     restrict: 'E',
//     scope: {},
//     bindToController: {
//         allowedTypes: '<allowedTypes', // an array of allowed extensions, ex: ['text/plain', 'image/png', 'image/jpg']
//         onFileChange: '&onFileChange', // fired when the user selects a file
//         onNotAllowed: '&onNotAllowed', // fired when the user inputs a non-allowed file
//         onFileUploaded: '&onFileUploaded' // fired when the file is uploaded to S3
//     },
//     require: ['^ngModel', 'uploadFile'],
//     link: UploadFileLink,
//     controller: UploadFileController,
//     controllerAs: '$ctrl',
//     templateUrl: '/views/partials/upload.html'
// };
