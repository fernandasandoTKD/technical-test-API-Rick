import { Component, inject } from '@angular/core';
import { CharacterService } from '../../core/services/character.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-character-detail',
  imports: [CommonModule],
  templateUrl: './character-detail.page.html',
  styleUrl: './character-detail.page.css'
})
export class CharacterDetailPage {

  private route = inject(ActivatedRoute);
  private characterService = inject(CharacterService);
  private router = inject(Router);

  character: any;
  originResident: any = null;
  locationResident: any = null;
  episode: any = null;

  ngOnInit(): void {
    //Obtener id de ruta activa desde la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.characterService.getCharacterById(+id).subscribe(character => {
        this.character = character;

    /**
 *Obtener datos de origen del personaje
 */
        if (character.origin?.url) {
          this.characterService.getByUrl(character.origin.url).subscribe(origin => {
            if (origin.residents?.length) {
              this.characterService.getByUrl(origin.residents[0]).subscribe(res => this.originResident = res);
            }
          });
        }

        /**
 * Obtner ogcalización actual de personaje
 */
        if (character.location?.url) {
          this.characterService.getByUrl(character.location.url).subscribe(loc => {
            if (loc.residents?.length) {
              this.characterService.getByUrl(loc.residents[0]).subscribe(res => this.locationResident = res);
            }
          });
        }

        // Episodio
        if (character.episode?.length) {
          this.characterService.getByUrl(character.episode[0]).subscribe(ep => this.episode = ep);
        }
      });
    }
  }


  /**
   * Método para navegar a la lista de personajes
   */
  navigateToList() {
    this.router.navigate(['/']);
  }
}




