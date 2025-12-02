# Frontend (Angular)

Dieses Verzeichnis enthält das Angular-Frontend für das Projekt.

Kurz: Ich scaffolde hier nur die Struktur. Um die App lokal zu starten, führe im `frontend`-Ordner folgendes aus (erfordert pnpm und Angular CLI):

```pwsh
pnpm create @angular/cli@latest frontend -- --directory . --routing --style=scss
pnpm install
pnpm ng serve --open
```

Wichtig: Die endgültige Scaffold- und Installationsschritte führe ich auf Wunsch automatisiert aus.
