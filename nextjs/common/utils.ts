import { AaveUser } from './types';
/**
 * Checks if an object fits the AaveUser interface
 * @param user - object
 */
export function isAaveUser(user: any): user is AaveUser {
  return user !== null && typeof user.useReserveAsCollateral === 'boolean';
}
