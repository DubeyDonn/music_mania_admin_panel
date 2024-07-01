import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArtistsService } from '../../services/artists/artists.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

interface Artist {
  _id: string;
  name: string;
  genres: string;
  popularity: number;
}

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css',
})
export class ArtistsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  tableDataSource = new MatTableDataSource<Artist>([]);
  isLoading = false;
  isMobile = window.innerWidth < 768;

  columns = [
    {
      columnDef: 'name',
      header: 'Name',
      cell: (row: Artist) => row.name,
    },
    {
      columnDef: 'genres',
      header: 'Genres',
      cell: (row: Artist) => row.genres,
    },
    {
      columnDef: 'popularity',
      header: 'Popularity',
      cell: (row: Artist) => row.popularity,
    },
    {
      columnDef: 'actions',
      header: 'Actions',
      action: true,
      editAction: (row: Artist) => this.openEditDialog(row),
      deleteAction: (row: Artist) => this.openDeleteDialog(row),
    },
  ];

  constructor(
    private readonly artistsService: ArtistsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchArtists();
  }

  fetchArtists(): void {
    this.isLoading = true;
    this.snackBar.open('Fetching artists...', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: this.isMobile ? 'bottom' : 'top',
    });

    this.artistsService.getAllArtists().subscribe({
      next: (response) => {
        this.tableDataSource.data = response;
        this.isLoading = false;
        this.snackBar.open('Artists fetched successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
      },
      error: (error) => {
        this.snackBar.open('Error fetching artists', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
        this.isLoading = false;
      },
    });
  }

  openEditDialog(artist: Artist): void {
    const dialogRef = this.dialog.open(ArtistEditDialog, {
      data: artist,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.isLoading = true;
      this.snackBar.open('Updating artist...', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });

      this.artistsService.updateArtist(artist._id, result).subscribe({
        next: () => {
          this.snackBar.open('Artist updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.fetchArtists();
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Error updating artist', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
        },
      });
    });
  }

  openDeleteDialog(artist: Artist): void {
    const dialogRef = this.dialog.open(ArtistDeleteDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.isLoading = true;
      this.snackBar.open('Deleting artist...', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });

      this.artistsService.deleteArtist(artist._id).subscribe({
        next: () => {
          this.snackBar.open('Artist deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.fetchArtists();
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Error deleting artist', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
        },
      });
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ArtistAddDialog, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      console.log(result);

      this.isLoading = true;
      this.snackBar.open('Adding artist...', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });

      this.artistsService.addArtist(result).subscribe({
        next: () => {
          this.snackBar.open('Artist added successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.fetchArtists();
          this.isLoading = false;
        },
        error: () => {
          this.snackBar.open('Error adding artist', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
        },
      });
    });
  }
}

@Component({
  selector: 'artist-edit-dialog',
  standalone: true,
  templateUrl: './artist-edit-dialog.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistEditDialog implements OnInit {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ArtistEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Artist
  ) {
    this.form = new FormGroup({
      name: new FormControl(data.name),
      genres: new FormControl(data.genres),
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      name: this.data.name,
      genres: this.data.genres,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    } else {
      this.dialogRef.close(this.form.value);
    }
  }
}

@Component({
  selector: 'artist-delete-dialog',
  standalone: true,
  templateUrl: './artist-delete-dialog.html',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistDeleteDialog {
  constructor() {}
}

@Component({
  selector: 'artist-add-dialog',
  standalone: true,
  templateUrl: './artist-add-dialog.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    NgxMatTimepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistAddDialog implements OnInit {
  form: FormGroup;
  selectedFileName: string | null = null;

  constructor(private dialogRef: MatDialogRef<ArtistAddDialog>) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      genres: new FormControl('', [Validators.required]),
      image: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    } else {
      // console.log(this.form.value);
      this.dialogRef.close(this.form.value);
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name; // Store the file name
      this.form.patchValue({
        image: file,
      });
      this.form.get('image')!.updateValueAndValidity();
    }
  }
}
