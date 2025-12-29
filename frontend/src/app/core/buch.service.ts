// src/app/core/buch.service.ts

import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

// =================================================================
// 1. DEFINITION DER GRAPHQL QUERY
// =================================================================
const BUCH_SUCHE_QUERY = gql`
    query Suche($suchparameter: SuchparameterInput) {
        buecher(suchparameter: $suchparameter) {
            id
            isbn
            titel {
                titel
            }
            preis
            rating
            lieferbar
        }
    }
`;

const BUCH_BY_ID_QUERY = gql`
    query Buch($id: ID!) {
        buch(id: $id) {
            id
            isbn
            titel {
                titel
            }
            preis
            rating
            art
            lieferbar
            rabatt
            schlagwoerter
            homepage
            datum
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
        // Build `suchparameter` only with set values; if empty, send no variable
        const suchparameter: any = {};
        const titel = filter?.titel?.toString().trim();
        if (titel) suchparameter.titel = titel;
        const isbn = filter?.isbn?.toString().trim();
        if (isbn) suchparameter.isbn = isbn;
        const schlagwoerter = filter?.schlagwoerter?.toString().trim();
        if (schlagwoerter) suchparameter.schlagwoerter = schlagwoerter;
        if (filter && filter.art && filter.art !== 'ALLE')
            suchparameter.art = filter.art;
        if (filter && filter.rating) suchparameter.rating = filter.rating;
        if (filter && filter.preis_filter && filter.preis_filter !== 'alle') {
            if (filter.preis_filter === 'unter20') suchparameter.preisMax = 20;
            if (filter.preis_filter === 'ueber20') suchparameter.preisMin = 20;
        }
        if (filter && typeof filter.lieferbar === 'boolean')
            suchparameter.lieferbar = filter.lieferbar;
        if (filter && filter.rabatt) suchparameter.rabatt = true;

        const variables: any = Object.keys(suchparameter).length
            ? { suchparameter }
            : {};

        return this.apollo
            .watchQuery<any>({
                query: BUCH_SUCHE_QUERY,
                variables,
                fetchPolicy: 'network-only',
            })
            .valueChanges.pipe(
                // 4. Mappen: Antwort sicher verarbeiten — falls `data` fehlt, leere Liste zurückgeben
                map((result: any) => {
                    if (result.errors) {
                        console.error(
                            'GraphQL-Fehler bei Buch-Suche',
                            result.errors,
                        );
                    }
                    return result?.data?.buecher ?? [];
                }),
            );
    }

    /**
     * Lädt ein Buch per ID (für Detailanzeige).
     */
    getById(id: number): Observable<any> {
        return this.apollo
            .query<any>({
                query: BUCH_BY_ID_QUERY,
                variables: { id: id.toString() },
                fetchPolicy: 'network-only',
            })
            .pipe(
                map((result: any) => {
                    if (result.errors) {
                        console.error(
                            'GraphQL-Fehler beim Laden des Buchs',
                            result.errors,
                        );
                    }
                    return result?.data?.buch ?? null;
                }),
            );
    }
}
