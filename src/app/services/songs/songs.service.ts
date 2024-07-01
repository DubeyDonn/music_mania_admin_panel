import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8000/';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  constructor(private http: HttpClient) {}

  getAllSongs(): Observable<any> {
    return this.http.get(AUTH_API + 'music/allTrack');
  }

  getSongById(trackId: any): Observable<any> {
    return this.http.get(AUTH_API + 'music/track/' + trackId);
  }

  addSong(data: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('name', data.name);
    formData.append('language', data.language);
    formData.append('duration', data.duration);
    formData.append('songFile', data.songFile);
    formData.append('albumId', data.albumId);
    formData.append('artworkImage', data.artworkImage);

    return this.http.post<any>(AUTH_API + 'admin/addTrack', formData);
  }

  updateSong(trackId: any, track: any): Observable<any> {
    return this.http.put(AUTH_API + 'music/track/edit/' + trackId, track);
  }

  deleteSong(trackId: any): Observable<any> {
    return this.http.delete(AUTH_API + 'music/track/delete/' + trackId);
  }
}
