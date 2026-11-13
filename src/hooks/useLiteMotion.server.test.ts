/**
 * @jest-environment node
 */
import { detectLiteMotion } from './useLiteMotion';

it('never enables the light-motion mode on the server', () => {
  expect(detectLiteMotion()).toBe(false);
});
