Quick Setup (Angular + pnpm + Keycloak + Apollo)

1. Voraussetzungen

- pnpm installiert
- Node.js 18+ empfohlen
- Angular CLI (optional)

2. Erstellen des Angular-Projekts im Ordner `frontend` (falls noch nicht gescaffoldet):

```pwsh
pnpm create @angular/cli@latest frontend -- --directory . --routing --style=scss
```

3. Abhängigkeiten installieren (Beispiel):

```pwsh
pnpm add bootstrap@5 ng-bootstrap apollo-angular @apollo/client graphql graphql-tag
pnpm add -D eslint prettier
pnpm add keycloak-js keycloak-angular
```

4. GraphQL + Keycloak konfigurieren

- Siehe `contract.md` und `keycloak-notes.md` für Details.
- Implementiere `graphql.module.ts` und `core/keycloak.service.ts`.

5. Starten

```pwsh
pnpm install
pnpm ng serve --open
```
