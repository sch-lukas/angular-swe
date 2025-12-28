# Frontend – Schnellstart

Kurze Anleitung, damit andere Entwickler:innen das Angular-Frontend zügig lokal starten können.

```powershell
PS C:\software-engineering\angular-swe\frontend> pnpm install
```

Entweder per Filter aus dem Wurzelordner:

```powershell
PS C:\software-engineering\angular-swe\frontend> pnpm start
```

Der Befehl startet `ng serve` und stellt die App auf `http://localhost:4200/` bereit.

Login:
admin
p

## Keycloak (Dev) konfigurieren

- Client `nest-client`:
  - Web Origins: `http://localhost:4200`
  - Valid Redirect URIs: `http://localhost:4200/*`
  - Access Type: confidential
  - Direct Access Grants: enabled
- Token-URL (wird im Frontend genutzt): `https://localhost:8843/realms/nest/protocol/openid-connect/token`
- Selbstsigniertes Zertifikat im Browser einmal akzeptieren, sonst schlägt der Token-Request mit Status 0 fehl.

Erlaubte ISBN
978-0-306-40615-7
978-1-56619-909-4
978-0-321-14653-3
978-0-393-04002-9
978-1-4028-9462-6
