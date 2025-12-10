import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BuchService } from '../../core/buch.service';

@Component({
    selector: 'app-suche',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './suche.html',
    styleUrl: './suche.css',
})
export class Suche implements OnInit {
    suchFormular: FormGroup;
    ergebnisse: any[] = [];
    laden: boolean = false;

    constructor(
        private fb: FormBuilder,
        private buchService: BuchService,
    ) {
        this.suchFormular = this.fb.group({
            titel: [''],
            isbn: [''],
            art: ['ALLE'],
            lieferbar: [null],
            rabatt_typ: ['alle'],
        });
    }

    ngOnInit(): void {
        this.suchen();
    }

    suchen(): void {
        this.laden = true;

        const filterWerte = this.suchFormular.value;

        this.buchService.suche(filterWerte).subscribe({
            next: (daten) => {
                this.ergebnisse = daten;
                this.laden = false;
            },
            error: (err) => {
                console.error('Fehler bei der GraphQL-Suche', err);
                this.laden = false;
            },
        });
    }
}
