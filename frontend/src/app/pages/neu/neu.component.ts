import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HttpHeaders } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { KeycloakService } from '../../core/keycloak.service';

const CREATE_MUTATION = gql`
    mutation Create($input: BuchInput!) {
        create(input: $input) {
            id
        }
    }
`;

// ISBN-13: startet mit 978 oder 979, 13 Ziffern, optionale Bindestriche/Leerzeichen
const ISBN_PATTERN = /^(?:97[89])(?:[- ]?\d){10}$/;

@Component({
    selector: 'app-neu',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
    templateUrl: './neu.component.html',
})
export class NeuComponent {
    // Auswahlwerte fuer Dropdowns und Checkboxen
    artOptionen = ['EPUB', 'HARDCOVER', 'PAPERBACK'];
    ratingOptionen = [0, 1, 2, 3, 4, 5];
    schlagwortKatalog = ['JAVASCRIPT', 'TYPESCRIPT', 'JAVA', 'PYTHON'];
    // Lade-Flag fuer UI
    loading = false;

    readonly defaultWerte = {
        titel: 'Der Titel',
        untertitel: 'Der Untertitel',
        isbn: '978-0-008-00644-0',
        rating: 5,
        art: 'EPUB',
        preis: 1,
        rabatt: 0.1,
        lieferbar: true,
        datum: { year: 2021, month: 1, day: 31 } as NgbDateStruct,
        homepage: 'https://test.de/',
        schlagwoerter: this.schlagwortKatalog.reduce(
            (acc, wort) => ({ ...acc, [wort]: true }),
            {} as Record<string, boolean>,
        ),
    };

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private apollo: Apollo,
        private keycloak: KeycloakService,
    ) {
        // Formular mit Validierungen aufbauen
        this.form = this.fb.group({
            titel: [this.defaultWerte.titel, Validators.required],
            untertitel: [this.defaultWerte.untertitel, Validators.required],
            isbn: [
                this.defaultWerte.isbn,
                [Validators.required, Validators.pattern(ISBN_PATTERN)],
            ],
            rating: [this.defaultWerte.rating, Validators.required],
            art: [this.defaultWerte.art, Validators.required],
            preis: [this.defaultWerte.preis, Validators.required],
            rabatt: [this.defaultWerte.rabatt, Validators.required],
            lieferbar: [this.defaultWerte.lieferbar],
            datum: [this.defaultWerte.datum],
            homepage: [
                this.defaultWerte.homepage,
                [
                    Validators.required,
                    // URL-Pruefung mit optionalem http/https
                    Validators.pattern(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?#].*)?$/),
                ],
            ],
            schlagwoerter: this.fb.group(this.defaultWerte.schlagwoerter),
        });
    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        // Token aus Keycloak holen
        const token = this.keycloak.getToken();
        if (!token) {
            alert('Bitte zuerst einloggen, um ein Buch anzulegen.');
            return;
        }

        const raw = this.form.value;
        const ausgewaehlteSchlagwoerter = this.schlagwortKatalog.filter(
            (wort) => raw.schlagwoerter?.[wort],
        );

        const datumStruct = raw.datum as NgbDateStruct | null;
        const datumIso =
            datumStruct != null
                ? new Date(
                      Date.UTC(
                          datumStruct.year,
                          datumStruct.month - 1,
                          datumStruct.day,
                      ),
                  ).toISOString()
                : undefined;

        const isbn = (raw.isbn as string | undefined)?.trim();
        if (!isbn || !ISBN_PATTERN.test(isbn)) {
            alert(
                'Bitte eine gueltige ISBN-13 (978/979, 13 Ziffern, Bindestriche/Leerzeichen optional) eingeben.',
            );
            this.loading = false;
            return;
        }

        // Payload fuer GraphQL bauen
        const payload = {
            isbn,
            rating: Number(raw.rating),
            art: raw.art,
            preis: Number(raw.preis),
            rabatt: Number(raw.rabatt),
            lieferbar: !!raw.lieferbar,
            datum: datumIso,
            homepage: raw.homepage || undefined,
            schlagwoerter: ausgewaehlteSchlagwoerter,
            titel: {
                titel: raw.titel,
                untertitel: raw.untertitel || undefined,
            },
        };

        this.apollo
            .mutate({
                mutation: CREATE_MUTATION,
                variables: { input: payload },
                context: {
                    headers: new HttpHeaders().set(
                        'Authorization',
                        `Bearer ${token}`,
                    ),
                },
            })
            .subscribe({
                next: () => {
                    alert('Buch erfolgreich angelegt');
                    this.form.reset(this.defaultWerte);
                },
                error: (err) => {
                    console.error('Fehler beim Anlegen', err);
                    alert('Anlegen fehlgeschlagen');
                },
            });
    }
}

