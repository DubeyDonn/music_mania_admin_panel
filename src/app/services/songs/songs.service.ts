import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8000/music/';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  constructor(private http: HttpClient) {}

  getAllSongs(): Observable<any> {
    return this.http.get(AUTH_API + 'allTrack');
  }

  getSongById(trackId: any): Observable<any> {
    return this.http.get(AUTH_API + 'track/' + trackId);
  }

  updateSong(trackId: any, track: any): Observable<any> {
    return this.http.put(AUTH_API + 'track/edit/' + trackId, track);
  }

  deleteSong(trackId: any): Observable<any> {
    return this.http.delete(AUTH_API + 'track/delete/' + trackId);
  }
}
