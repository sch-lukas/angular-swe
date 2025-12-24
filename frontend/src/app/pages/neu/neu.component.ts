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

@Component({
    selector: 'app-neu',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
    template: `
        <div class="card">
            <div class="card-body">
                <h2 class="h5 mb-4">Neues Buch anlegen</h2>

                <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Titel *</label>
                            <input
                                class="form-control"
                                type="text"
                                formControlName="titel"
                            />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Untertitel</label>
                            <input
                                class="form-control"
                                type="text"
                                formControlName="untertitel"
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">ISBN *</label>
                            <input
                                class="form-control"
                                type="text"
                                formControlName="isbn"
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Art *</label>
                            <select
                                class="form-select"
                                formControlName="art"
                            >
                                <option
                                    *ngFor="let option of artOptionen"
                                    [value]="option"
                                >
                                    {{ option }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Rating *</label>
                            <div class="d-flex flex-wrap gap-2">
                                <div
                                    class="form-check form-check-inline"
                                    *ngFor="let option of ratingOptionen"
                                >
                                    <input
                                        class="form-check-input"
                                        type="radio"
                                        [value]="option"
                                        formControlName="rating"
                                        id="rating-{{ option }}"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="rating-{{ option }}"
                                    >
                                        {{ option }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Lieferbar</label>
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    formControlName="lieferbar"
                                    id="lieferbar"
                                />
                                <label class="form-check-label" for="lieferbar">
                                    Sofort lieferbar
                                </label>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Preis (EUR) *</label>
                            <input
                                class="form-control"
                                type="number"
                                step="0.01"
                                formControlName="preis"
                            />
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Rabatt *</label>
                            <input
                                class="form-control"
                                type="number"
                                step="0.001"
                                min="0"
                                max="1"
                                formControlName="rabatt"
                            />
                            <div class="form-text">
                                Angabe als Dezimalzahl (z.B. 0.150 = 15%)
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Erscheinungsdatum</label>
                            <div class="input-group">
                                <input
                                    class="form-control"
                                    ngbDatepicker
                                    #dp="ngbDatepicker"
                                    formControlName="datum"
                                    placeholder="JJJJ-MM-TT"
                                />
                                <button
                                    class="btn btn-outline-secondary"
                                    type="button"
                                    (click)="dp.toggle()"
                                >
                                    Kalender
                                </button>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Homepage</label>
                            <input
                                class="form-control"
                                type="url"
                                formControlName="homepage"
                            />
                        </div>

                        <div class="col-12">
                            <label class="form-label">Schlagwörter</label>
                            <div
                                class="d-flex flex-wrap gap-3"
                                formGroupName="schlagwoerter"
                            >
                                <div
                                    class="form-check"
                                    *ngFor="let wort of schlagwortKatalog"
                                >
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        [formControlName]="wort"
                                        id="schlag-{{ wort }}"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="schlag-{{ wort }}"
                                    >
                                        {{ wort }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 d-flex gap-2">
                        <button class="btn btn-primary" type="submit">
                            Speichern
                        </button>
                        <button
                            class="btn btn-outline-secondary"
                            type="button"
                            (click)="form.reset(defaultWerte)"
                        >
                            Zurücksetzen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `,
})
export class NeuComponent {
    artOptionen = ['EPUB', 'HARDCOVER', 'PAPERBACK'];
    ratingOptionen = [0, 1, 2, 3, 4, 5];
    schlagwortKatalog = ['JAVASCRIPT', 'TYPESCRIPT', 'JAVA', 'PYTHON'];
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
        this.form = this.fb.group({
            titel: [this.defaultWerte.titel, Validators.required],
            untertitel: [this.defaultWerte.untertitel],
            isbn: [this.defaultWerte.isbn, Validators.required],
            rating: [this.defaultWerte.rating, Validators.required],
            art: [this.defaultWerte.art, Validators.required],
            preis: [this.defaultWerte.preis, Validators.required],
            rabatt: [this.defaultWerte.rabatt, Validators.required],
            lieferbar: [this.defaultWerte.lieferbar],
            datum: [this.defaultWerte.datum],
            homepage: [this.defaultWerte.homepage],
            schlagwoerter: this.fb.group(this.defaultWerte.schlagwoerter),
        });
    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

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
        if (!isbn || !/^\d{3}-\d-\d{3}-\d{5}-\d$/.test(isbn)) {
            alert(
                'Bitte eine gültige ISBN-13 im Format 978-x-xxx-xxxxx-x eingeben.',
            );
            this.loading = false;
            return;
        }

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
