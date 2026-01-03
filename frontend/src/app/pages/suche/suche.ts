import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    NgbDropdownModule,
    NgbModal,
    NgbModalModule,
    NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { BuchService } from '../../core/buch.service';

@Component({
    selector: 'app-suche',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbPaginationModule,
    ],
    templateUrl: './suche.html',
    styleUrl: './suche.css',
})
export class Suche implements OnInit {
    suchFormular: FormGroup;
    buecher: any[] = [];
    sichtbareBuecher: any[] = [];
    laden: boolean = false;
    selectedBuch: any = null;
    page = 1;
    pageSize = 5;
    collectionSize = 0;

    @ViewChild('detailModal') detailModal: any;

    constructor(
        private fb: FormBuilder,
        private buchService: BuchService,
        private modalService: NgbModal,
        private cdr: ChangeDetectorRef,
    ) {
        this.suchFormular = this.fb.group({
            titel: [''],
            isbn: [''],
            schlagwoerter: [''],
            art: ['ALLE'],
            rating: [null],
            lieferbar: [null],
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
                this.collectionSize = daten?.length ?? 0;
                this.page = 1;
                this.aktualisierePagination();
                this.laden = false;
                try {
                    this.cdr.detectChanges();
                } catch {
                    // ignore
                }
            },
            error: (err) => {
                console.error('Fehler bei der GraphQL-Suche', err);
                this.laden = false;
            },
        });
    }

    onPageChange(page: number): void {
        this.page = page;
        this.aktualisierePagination();
    }

    resetRating(): void {
        this.suchFormular.get('rating')?.setValue(null);
    }

    private aktualisierePagination(): void {
        const start = (this.page - 1) * this.pageSize;
        this.sichtbareBuecher = this.buecher.slice(
            start,
            start + this.pageSize,
        );
    }

    detailsAnzeigen(buch: any): void {
        // Lade vollständige Details per ID und zeige Modal
        const id = buch?.id ?? buch?.isbn ?? null;
        if (!id) {
            this.selectedBuch = buch;
            try {
                this.cdr.detectChanges();
            } catch {}
            this.modalService.open(this.detailModal, {
                windowClass: 'show',
                backdropClass: 'show',
            });
            return;
        }

        this.buchService.getById(Number(id)).subscribe({
            next: (full) => {
                // Konvertiere ggf. Timestamp-String in Number, damit die date-Pipe funktioniert
                if (
                    full &&
                    full.datum &&
                    typeof full.datum === 'string' &&
                    /^[0-9]+$/.test(full.datum)
                ) {
                    try {
                        full.datum = Number(full.datum);
                    } catch {
                        // leave as-is
                    }
                }
                this.selectedBuch = full ?? buch;
                try {
                    this.cdr.detectChanges();
                } catch {}
                this.modalService.open(this.detailModal, {
                    windowClass: 'show',
                    backdropClass: 'show',
                });
            },
            error: (err) => {
                console.error('Fehler beim Laden der Buch-Details', err);
                // Fallback: vorhandene Daten anzeigen
                this.selectedBuch = buch;
                try {
                    this.cdr.detectChanges();
                } catch {}
                this.modalService.open(this.detailModal, {
                    windowClass: 'show',
                    backdropClass: 'show',
                });
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
