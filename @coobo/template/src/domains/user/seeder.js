export default ({ Factory }) => {
    return Factory.blueprint('User', (fake) => ({
        email: fake.email(),
        password: fake.password(),
        firstName: fake.firstName(),
        lastName: fake.lastName()
    }));
};
