import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AlbumsService } from '../../services/albums/albums.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ArtistsService } from '../../services/artists/artists.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TableComponent } from '../../components/table/table.component';

interface Album {
  _id: string;
  name: string;
  artist: any;
  genres: string;
}

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    TableComponent,
    MatButtonModule,
  ],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css',
})
export class AlbumsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  tableDataSource = new MatTableDataSource<Album>([]);
  isLoading = false;
  isMobile = window.innerWidth < 768;
  artists: any[] = [];

  columns = [
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: Album) => element.name,
    },
    {
      columnDef: 'artist',
      header: 'Artist',
      cell: (element: Album) => element.artist.name,
    },
    {
      columnDef: 'genre',
      header: 'Genre',
      cell: (element: Album) => element.genres,
    },
    {
      columnDef: 'actions',
      header: 'Actions',
      action: true,
      editAction: (element: Album) => {
        this.openEditDialog(element);
      },
      deleteAction: (element: Album) => {
        this.openDeleteDialog(element);
      },
    },
  ];

  constructor(
    private albumsService: AlbumsService,
    private snackBar: MatSnackBar,
    private artistsService: ArtistsService
  ) {}

  ngOnInit(): void {
    this.fetchAlbums();
    this.fetchArtists();
  }

  fetchAlbums(): void {
    this.isLoading = true;
    this.snackBar.open('Fetching Albums', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: this.isMobile ? 'bottom' : 'top',
    });

    this.albumsService.getAllAlbums().subscribe({
      next: (albums: any) => {
        this.tableDataSource.data = albums;
        this.isLoading = false;
        this.snackBar.open('Albums Fetched', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to fetch albums', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
      },
    });
  }

  fetchArtists(): void {
    this.artistsService.getAllArtists().subscribe({
      next: (artists: any) => {
        this.artists = artists;
        this.snackBar.open('Artists Fetched', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to fetch artists', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: this.isMobile ? 'bottom' : 'top',
        });
      },
    });
  }

  openEditDialog(album: Album): void {
    const dialogRef = this.dialog.open(AlbumEditDialog, {
      width: '600px',
      data: {
        album,
        artists: this.artists,
      },
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (!formData) {
        return;
      }

      this.isLoading = true;
      this.snackBar.open('Updating album...', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });

      this.albumsService.updateAlbum(album._id, formData).subscribe({
        next: (response: any) => {
          this.snackBar.open('Album updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
          this.fetchAlbums();
        },
        error: (error: any) => {
          this.snackBar.open('Error updating album', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
        },
      });
    });
  }

  openDeleteDialog(album: Album): void {
    const dialogRef = this.dialog.open(AlbumDeleteDialog, {
      width: '600px',
      data: album,
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (!formData) {
        return;
      }

      this.isLoading = true;
      this.snackBar.open('Deleting album...', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });

      this.albumsService.deleteAlbum(album._id).subscribe({
        next: (response: any) => {
          this.snackBar.open('Album deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
          this.fetchAlbums();
        },
        error: (error: any) => {
          this.snackBar.open('Error deleting album', 'Close', {
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
    const dialogRef = this.dialog.open(AlbumAddDialog, {
      width: '600px',
      data: {
        artists: this.artists,
      },
    });

    dialogRef.afterClosed().subscribe((formData) => {
      if (!formData) {
        return;
      }

      this.isLoading = true;
      this.snackBar.open('Adding album...', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: this.isMobile ? 'bottom' : 'top',
      });

      this.albumsService.addAlbum(formData).subscribe({
        next: (response: any) => {
          this.snackBar.open('Album added successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: this.isMobile ? 'bottom' : 'top',
          });
          this.isLoading = false;
          this.fetchAlbums();
        },
        error: (error: any) => {
          this.snackBar.open('Error adding album', 'Close', {
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
  selector: 'edit-album-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './edit-album-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumEditDialog implements OnInit {
  form: FormGroup;
  artists: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<AlbumEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { album: Album; artists: any[] }
  ) {
    this.form = new FormGroup({
      name: new FormControl(data.album.name, Validators.required),
      artistId: new FormControl(data.album.artist._id, Validators.required),
      genres: new FormControl(data.album.genres, Validators.required),
    });
  }

  ngOnInit(): void {
    this.artists = this.data.artists;
    this.form.patchValue({
      name: this.data.album.name,
      artistId: this.data.album.artist._id,
      genres: this.data.album.genres,
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
  selector: 'add-album-dialog',
  templateUrl: 'add-album-dialog.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumAddDialog implements OnInit {
  form: FormGroup;
  albums: any[] = [];
  artists: any[] = [];

  selectedFileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private albumsService: AlbumsService,
    private dialogRef: MatDialogRef<AlbumAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      artistId: [null, Validators.required],
      genres: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.artists = this.data.artists;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
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

@Component({
  selector: 'delete-album-dialog',
  templateUrl: 'delete-album-dialog.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumDeleteDialog {
  constructor() {}
}
