import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    NgbDropdownModule,
    NgbModal,
    NgbModalModule,
    NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { BuchService } from '../../core/buch.service';

/**
 * Komponente zur Suche und Anzeige von Büchern mit Filteroptionen und Pagination.
 */
@Component({
    selector: 'app-suche',
    standalone: true,
    imports: [
        CurrencyPipe,
        DatePipe,
        ReactiveFormsModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbPaginationModule,
    ],
    templateUrl: './suche.html',
    styleUrl: './suche.css',
})
export class Suche implements OnInit {
    // Reaktives Formular für Suchfilter
    suchFormular: FormGroup;

    // Alle gefundenen Bücher
    buecher: any[] = [];

    // Aktuell angezeigte Bücher (paginiert)
    sichtbareBuecher: any[] = [];

    // Ladezustand während der Suche
    laden: boolean = false;

    // Aktuell ausgewähltes Buch für Detailansicht
    selectedBuch: any = null;

    // Pagination-Einstellungen
    page = 1;
    pageSize = 5;
    collectionSize = 0;

    // Referenz auf das Detail-Modal im Template
    @ViewChild('detailModal') detailModal: any;

    constructor(
        private fb: FormBuilder,
        private buchService: BuchService,
        private modalService: NgbModal,
        private cdr: ChangeDetectorRef,
    ) {
        // Initialisiere Suchformular mit Standardwerten
        this.suchFormular = this.fb.group({
            titel: [''],
            isbn: [''],
            art: ['ALLE'],
            rating: [null],
            lieferbar: [null],
        });
    }

    /** Führt initiale Suche beim Laden der Komponente aus */
    ngOnInit(): void {
        this.suchen();
    }

    /** Führt die Buchsuche mit aktuellen Filterkriterien aus */
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
                    // ChangeDetection-Fehler ignorieren
                }
            },
            error: (err) => {
                console.error('Fehler bei der GraphQL-Suche', err);
                this.laden = false;
            },
        });
    }

    /** Wechselt zur angegebenen Seite in der Pagination */
    onPageChange(page: number): void {
        this.page = page;
        this.aktualisierePagination();
    }

    /** Setzt das Rating-Feld auf null zurück */
    resetRating(): void {
        this.suchFormular.get('rating')?.setValue(null);
    }

    /** Berechnet sichtbare Bücher basierend auf aktueller Seite */
    private aktualisierePagination(): void {
        const start = (this.page - 1) * this.pageSize;
        this.sichtbareBuecher = this.buecher.slice(
            start,
            start + this.pageSize,
        );
    }

    /** Lädt vollständige Buchdetails und öffnet das Detail-Modal */
    detailsAnzeigen(buch: any): void {
        const id = buch?.id ?? buch?.isbn ?? null;

        // Fallback: Zeige vorhandene Daten wenn keine ID verfügbar
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

        // Lade vollständige Buchdetails vom Backend
        this.buchService.getById(Number(id)).subscribe({
            next: (full) => {
                // Konvertiere Timestamp-String für date-Pipe Kompatibilität
                if (
                    full &&
                    full.datum &&
                    typeof full.datum === 'string' &&
                    /^[0-9]+$/.test(full.datum)
                ) {
                    try {
                        full.datum = Number(full.datum);
                    } catch {
                        // Originalwert beibehalten
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
                // Fallback: Zeige vorhandene Daten bei Fehler
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
