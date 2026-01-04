/**
 * Service zur Kommunikation mit dem GraphQL-Backend für Buch-Operationen.
 * Bietet Methoden zur Suche und zum Laden von Buchdetails.
 */

import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

// =================================================================
// GraphQL Queries für Buch-Operationen
// =================================================================

/** Query für die Buchsuche mit optionalen Filterparametern */
const BUCH_SUCHE_QUERY = gql`
    query Suche($suchparameter: SuchparameterInput) {
        buecher(suchparameter: $suchparameter) {
            id
            isbn
            titel {
                titel
            }
            preis
            rabatt
            rating
            lieferbar
        }
    }
`;

/** Query zum Laden eines einzelnen Buchs mit allen Details */
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
    /** Apollo-Client für GraphQL-Anfragen */
    constructor(private apollo: Apollo) {}

    /**
     * Führt eine GraphQL-Suche nach Büchern basierend auf Filterparametern durch.
     * @param filter Suchkriterien (titel, isbn, art, rating, lieferbar)
     * @returns Observable mit Array der gefundenen Bücher
     */
    suche(filter: any): Observable<any[]> {
        // Nur gesetzte Filterwerte an das Backend senden
        const suchparameter: any = {};

        const titel = filter?.titel?.toString().trim();
        if (titel) suchparameter.titel = titel;

        const isbn = filter?.isbn?.toString().trim();
        if (isbn) suchparameter.isbn = isbn;

        if (filter?.art && filter.art !== 'ALLE') {
            suchparameter.art = filter.art;
        }

        if (filter?.rating) {
            suchparameter.rating = filter.rating;
        }

        if (filter?.lieferbar === true) {
            suchparameter.lieferbar = true;
        }

        // Leere Suchparameter werden nicht mitgesendet
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
                map((result: any) => {
                    // Fehlerbehandlung
                    if (result.errors) {
                        console.error(
                            'GraphQL-Fehler bei Buch-Suche',
                            result.errors,
                        );
                    }

                    // Ergebnis kann Array oder Slice-Objekt (mit content) sein
                    const buecherRaw = result?.data?.buecher;
                    if (Array.isArray(buecherRaw)) {
                        return buecherRaw;
                    }
                    if (buecherRaw && Array.isArray(buecherRaw.content)) {
                        return buecherRaw.content;
                    }
                    return [];
                }),
            );
    }

    /**
     * Lädt ein einzelnes Buch anhand seiner ID.
     * @param id Die Buch-ID
     * @returns Observable mit den vollständigen Buchdaten oder null
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
