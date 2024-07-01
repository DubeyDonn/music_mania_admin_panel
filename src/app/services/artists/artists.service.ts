import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const AUTH_API = 'http://localhost:8000/';

@Injectable({
  providedIn: 'root',
})
export class ArtistsService {
  constructor(private http: HttpClient) {}

  getAllArtists(): Observable<any> {
    return this.http.get(AUTH_API + 'music/allArtist');
  }

  getArtistById(artistId: any): Observable<any> {
    return this.http.get(AUTH_API + 'music/artist/' + artistId);
  }

  addArtist(data: any): Observable<any> {
    var artistForm = new FormData();
    artistForm.append('name', data.name);
    artistForm.append('genres', data.genres);
    artistForm.append('image', data.image);
    return this.http.post(AUTH_API + 'admin/addArtist', artistForm);
  }

  deleteArtist(artistId: any): Observable<any> {
    return this.http.delete(AUTH_API + 'music/artist/delete/' + artistId);
  }

  updateArtist(id: any, data: any): Observable<any> {
    return this.http.put(AUTH_API + 'music/artist/edit/' + id, data);
  }
}
