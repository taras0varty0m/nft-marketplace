import { registerAs } from '@nestjs/config';

export default registerAs('graphql', () => {
  return {
    enablePlayground: process.env.ENABLE_GRAPHQL_PLAYGROUND,
  };
});
