import { mergeConfig } from 'vitest/config';
import { shared } from './vitest.shared';

export default mergeConfig(shared, {
  test: { include: ['test/integration/**/*.test.{ts,tsx}'] },
});
