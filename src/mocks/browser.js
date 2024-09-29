import { setupWorker } from 'msw/browser'
import { handlers } from './handlers';

// Initialize and export the worker with the handlers
export const worker = setupWorker(...handlers);