import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BuchService } from '../../core/buch.service';

@Component({
    selector: 'app-suche',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgbDropdownModule, NgbModalModule],
    templateUrl: './suche.html',
    styleUrl: './suche.css',
})
export class Suche implements OnInit {
    suchFormular: FormGroup;
    buecher: any[] = [];
    laden: boolean = false;
    selectedBuch: any = null;

    @ViewChild('detailModal') detailModal: any;

    constructor(
        private fb: FormBuilder,
        private buchService: BuchService,
        private modalService: NgbModal,
    ) {
        this.suchFormular = this.fb.group({
            titel: [''],
            isbn: [''],
            schlagwoerter: [''],
            art: ['ALLE'],
            rating: [null],
            preis_filter: ['alle'],
            lieferbar: [null],
            rabatt: [false],
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
                this.buecher = daten;
                this.laden = false;
            },
            error: (err) => {
                console.error('Fehler bei der GraphQL-Suche', err);
                this.laden = false;
            },
        });
    }

    detailsAnzeigen(buch: any): void {
        // Lade vollständige Details per ID und zeige Modal
        const id = buch?.id ?? buch?.isbn ?? null;
        if (!id) {
            this.selectedBuch = buch;
            this.modalService.open(this.detailModal);
            return;
        }

        this.buchService.getById(Number(id)).subscribe({
            next: (full) => {
                // Konvertiere ggf. Timestamp-String in Number, damit die date-Pipe funktioniert
                if (full && full.datum && typeof full.datum === 'string' && /^[0-9]+$/.test(full.datum)) {
                    try {
                        full.datum = Number(full.datum);
                    } catch {
                        // leave as-is
                    }
                }
                this.selectedBuch = full ?? buch;
                this.modalService.open(this.detailModal);
            },
            error: (err) => {
                console.error('Fehler beim Laden der Buch-Details', err);
                // Fallback: vorhandene Daten anzeigen
                this.selectedBuch = buch;
                this.modalService.open(this.detailModal);
            },
        });
    }

    /**
     * Formatiert `rabatt` aus dem Backend: Dezimalzahl (0.15) -> Prozent (15 %).
     * Akzeptiert Zahlen oder Strings (evtl. mit '%' oder als Timestamp-String).
     */
    formatRabatt(value: any): string {
        if (value === undefined || value === null) return '';
        // If backend already returns a string containing '%', strip it first
        if (typeof value === 'string' && value.includes('%')) {
            const cleaned = value.replace('%', '').trim();
            const n = Number(cleaned);
            if (Number.isNaN(n)) return value;
            const percent = n <= 1 ? n * 100 : n;
            return `${Math.round(percent * 100) / 100}%`;
        }
        const num = Number(value);
        if (Number.isNaN(num)) return String(value);
        const percent = num <= 1 ? num * 100 : num;
        return `${Math.round(percent * 100) / 100}%`;
    }
}
