/**
 * Mock for @wordpress/interactivity module.
 */

export const store = jest.fn( ( _namespace: string, config: unknown ) => config );
export const getContext = jest.fn( () => ( {} ) );
export const getElement = jest.fn( () => ( { ref: null } ) );
export const withScope = jest.fn( ( callback: () => void ) => callback );
