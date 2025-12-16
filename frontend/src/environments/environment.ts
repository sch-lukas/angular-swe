export const environment = {
    production: false,
    keycloak: {
        url: '/auth/realms/nest/protocol/openid-connect/token',
        clientId: 'nest-client',
        // Dev-only: hier das Secret hinterlegen
        clientSecret: 'OD58W32Jr1jahDkimToraDryJrsWSxTD',
    },
};
