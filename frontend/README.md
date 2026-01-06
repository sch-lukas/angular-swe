# Frontend – Schnellstart


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
- Selbstsigniertes Zertifikat im Browser einmal akzeptieren, sonst schlägt der Token-Request mit Status 0 fehl: https://localhost:8843/realms/nest/account

## Playwright Test

cd C:\software-engineering\angular-swe\frontend
pnpm exec playwright test --config test/Frontend/playwright.config.ts

https://test.de/
Erlaubte ISBN
978-1-4028-9462-6
978-0-596-52068-7
978-1-59327-584-6
978-1-4919-6418-3
978-3-86680-192-9
978-0-201-63361-0
978-0-321-35668-0
978-0-13-468599-1
978-1-59327-950-9
978-1-4919-1889-4
978-0-306-40615-7
978-0-321-14653-3
978-0-393-04002-9
