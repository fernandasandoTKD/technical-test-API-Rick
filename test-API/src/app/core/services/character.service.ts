import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, mergeMap, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

   getAllCharacters(filters: any = {}) {
    return this.http.get<any>(this.apiUrl, { params: filters }).pipe(
      switchMap(first => {
        const pages = Array.from({ length: first.info.pages }, (_, i) =>
          this.http.get<any>(this.apiUrl, { params: { ...filters, page: i + 1 } })
        );
        return forkJoin(pages).pipe(
          map(all => all.flatMap(res => res.results))
        );
      })
    );
  }
}


