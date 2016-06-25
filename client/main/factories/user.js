function user ($window) {
  if (
    $window.STATE_FROM_SERVER == null ||
    $window.STATE_FROM_SERVER.user == null
  ) throw new Error('page should have STATE_FROM_SERVER at runtime');
  return $window.STATE_FROM_SERVER.user;
}
export default user;
