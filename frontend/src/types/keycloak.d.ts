declare module 'keycloak-js' {
    export interface KeycloakInstance {
        init(options?: any): Promise<boolean> | Promise<void>;
        token?: string;
        authenticated?: boolean;
        login(options?: any): Promise<void>;
        logout(options?: any): Promise<void>;
        hasRealmRole(role: string): boolean;
    }

    function Keycloak(config?: any): KeycloakInstance;
    export default Keycloak;
}
