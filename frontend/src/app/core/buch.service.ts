// src/app/core/buch.service.ts

import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

// =================================================================
// 1. DEFINITION DER GRAPHQL QUERY
// =================================================================
const BUCH_SUCHE_QUERY = gql`
    query Suche(
        $titel: String
        $isbn: String
        $art: BuchArtEnum
        $lieferbar: Boolean
    ) {
        buecher(titel: $titel, isbn: $isbn, art: $art, lieferbar: $lieferbar) {
            id
            titel {
                titel
            }
            preis
            lieferbar
        }
    }
`;

@Injectable({
    providedIn: 'root',
})
export class BuchService {
    // 2. Den Apollo-Client injizieren
    constructor(private apollo: Apollo) {}

    /**
     * Führt eine GraphQL-Suche nach Büchern basierend auf Filterparametern durch.
     */
    suche(filter: any): Observable<any[]> {
        // 3. Die Apollo-Query ausführen
        return this.apollo
            .watchQuery<any>({
                query: BUCH_SUCHE_QUERY,
                variables: filter, // Das Filterobjekt aus der Komponente wird als Variablen übergeben
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(
                // 4. Mappen: Nur das Array der Bücher aus der Antwort extrahieren
                map((result) => result.data.buecher),
            );
    }
}
