import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SongsService } from '../../services/songs/songs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { lang } from 'moment';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

export interface Song {
  _id: number;
  name: string;
  artist: any;
  album: any;
  duration: number;
  popularity: number;
  language: string;
}

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, TableComponent, MatProgressSpinnerModule],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.css',
})
export class SongsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  tableDataSource = new MatTableDataSource<Song>([]);
  isLoading = false;
  isMobile = window.innerWidth < 768;

  columns = [
    {
      columnDef: 'name',
      header: 'Name',
      sortable: true,
      cell: (element: Song) => `${element.name}`,
    },
    {
      columnDef: 'artist',
      header: 'Artist',
      sortable: true,
      cell: (element: Song) => `${element.artist.name}`,
    },
    {
      columnDef: 'album',
      header: 'Album',
      sortable: true,
      cell: (element: Song) => `${element.album.name}`,
    },
    {
      columnDef: 'duration',
      header: 'Duration',
      sortable: true,
      cell: (element: Song) => `${element.duration}`,
    },
    {
      columnDef: 'popularity',
      header: 'Popularity',
      sortable: true,
      cell: (element: Song) => `${element.popularity}`,
    },
    {
      columnDef: 'language',
      header: 'Language',
      sortable: true,
      cell: (element: Song) => `${element.language}`,
    },
    {
      columnDef: 'actions',
      header: 'Actions',
      action: true,
      editAction: (element: Song) => {
        this.openEditDialog(element);
      },
      deleteAction: (element: Song) => {
        this.openDeleteDialog(element);
      },
    },
  ];

  constructor(
    private songsService: SongsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchSongs();
  }

  fetchSongs(): void {
    this.isLoading = true;
    this.snackBar.open('Fetching songs', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: this.isMobile ? 'bottom' : 'top',
    });

    this.songsService.getAllSongs().subscribe({
      next: (response: any) => {
        this.tableDataSource.data = response;
        this.isLoading = false;
        this.snackBar.open('Songs fetched successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error fetching songs', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
        this.isLoading = false;
      },
    });
  }

  openEditDialog(song: Song): void {
    const dialogRef = this.dialog.open(SongEditDialog, {
      width: '600px',
      data: song,
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (!formData) {
        return;
      }

      this.isLoading = true;
      this.snackBar.open('Updating song...', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });

      this.songsService.updateSong(song._id, formData).subscribe({
        next: (response: any) => {
          this.snackBar.open('Song updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
          this.fetchSongs();
        },
        error: (error: any) => {
          this.snackBar.open('Error updating song', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
        },
      });
    });
  }

  openDeleteDialog(song: Song): void {
    const dialogRef = this.dialog.open(SongDeleteDialog, {
      width: '600px',
      data: song,
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (!formData) {
        return;
      }

      this.isLoading = true;
      this.snackBar.open('Deleting song...', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });

      this.songsService.deleteSong(song._id).subscribe({
        next: (response: any) => {
          this.snackBar.open('Song deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
          this.fetchSongs();
        },
        error: (error: any) => {
          this.snackBar.open('Error deleting song', 'Close', {
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
  selector: 'edit-song-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './edit-song-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongEditDialog implements OnInit {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SongEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Song
  ) {
    this.form = new FormGroup({
      name: new FormControl(data.name),
      duration: new FormControl(data.duration),
      language: new FormControl(data.language),
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      name: this.data.name,
      duration: this.data.duration,
      language: this.data.language,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.dialogRef.close(this.form.value);
    }
  }
}

@Component({
  selector: 'delete-song-dialog',
  templateUrl: 'delete-song-dialog.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongDeleteDialog {
  constructor() {}
}
