/**
 * Drives step registration response contract
 */
export interface RegistrationResponse {
  // Indidicate if step has been registered
  isRegistered: boolean;

  // If any, the error occured while performing step registration
  error: Error;
}
