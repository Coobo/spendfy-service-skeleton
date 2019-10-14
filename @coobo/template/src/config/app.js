export default {
    name: Env.getOrFail('APP_NAME'),
    port: Env.getOrFail('APP_PORT'),
    url: Env.getOrFail('APP_URL'),
    secret: Env.getOrFail('APP_SECRET')
};
