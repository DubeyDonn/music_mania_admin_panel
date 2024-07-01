import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8000/';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {
  constructor(private http: HttpClient) {}

  getAllAlbums(): Observable<any> {
    return this.http.get(AUTH_API + 'music/allAlbum');
  }

  getAlbumById(albumId: any): Observable<any> {
    return this.http.get(AUTH_API + 'music/album/' + albumId);
  }

  addAlbum(albumFrom: any): Observable<any> {
    var formData = new FormData();
    formData.append('name', albumFrom.name);
    formData.append('artistId', albumFrom.artistId);
    formData.append('genres', albumFrom.genres);
    formData.append('image', albumFrom.image);

    return this.http.post(AUTH_API + 'admin/addAlbum', formData);
  }

  deleteAlbum(albumId: any): Observable<any> {
    return this.http.delete(AUTH_API + 'music/album/delete/' + albumId);
  }

  updateAlbum(id: any, data: any): Observable<any> {
    return this.http.put(AUTH_API + 'music/album/edit/' + id, data);
  }
}
