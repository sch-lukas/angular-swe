# Keycloak Integration Notes

- Keycloak ist erforderlich für geschützte GraphQL-Mutationen (create/update/delete).
- Empfohlenes Setup:
  - Realm: `books-realm`
  - Client: `angular-frontend` (Public client, Valid Redirect URIs z.B. `http://localhost:4200/*`)
  - Roles: `user`, `admin`
  - Test-User: `student` (role user), `teacher` (role admin)

Integration in Angular:

- Verwende das offizielle Keycloak JS Adapter oder `keycloak-angular` Paket.
- Nach erfolgreichem Login: speichere Token/RefreshToken im Keycloak-Adapter; expose eine `KeycloakService` die `getToken()` liefert.
- Apollo HTTP-Link soll `Authorization: Bearer <token>` an alle Requests hängen. Ausnahme: public queries können ohne Header gesendet werden.

Lokales Testen:

- Keycloak kann als Docker-Container gestartet werden (z.B. quay.io/keycloak/keycloak). Nutze dev-Modus oder importiere Realm JSON während Start.
- Für schnelle Tests kann man das Token auch manuell in `localStorage` setzen, ist aber unsicher.
