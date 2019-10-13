module.exports = ({ Env }) => ({
    app: {
        name: Env.get('APP_NAME'),
        port: Env.get('APP_PORT')
    }
});
