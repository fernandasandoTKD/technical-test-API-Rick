import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CharacterService } from '../../core/services/character.service';
import { debounceTime } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButton,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  private characterService = inject(CharacterService);
  private snackBar = inject(MatSnackBar);


  // Filtros
  nameControl = new FormControl('');
  statusControl = new FormControl('');
  statuses = ['alive', 'dead', 'unknown'];


  // Tabla
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['name', 'status', 'species', 'type', 'gender', 'created', 'actions'];

  //Totales
  totalBySpecies: { species: string; count: number }[] = [];
  totalByType: { type: string; count: number }[] = [];

  favoriteCharacter: any = null;



  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadCharacters();

    this.nameControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.loadCharacters());
    this.statusControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.loadCharacters());
  }

  loadCharacters(): void {
    this.characterService.getAllCharacters({
      name: this.nameControl.value ?? '',
      status: this.statusControl.value ?? ''
    }).subscribe({
      next: (allCharacters) => {
        this.dataSource.data = allCharacters;
        this.dataSource.paginator = this.paginator;
        this.calculateTotals(allCharacters);
      },
      error: () => {
        this.dataSource.data = [];
      }

    });

  }

  clearFilters(): void {
    this.nameControl.setValue('');
    this.statusControl.setValue('');
  }

   calculateTotals(characters: any[]): void {
    const speciesMap = new Map<string, number>();
    const typeMap = new Map<string, number>();

    for (const char of characters) {
      const species = char.species || 'Sin especie';
      const type = char.type || 'Sin tipo';

      speciesMap.set(species, (speciesMap.get(species) || 0) + 1);
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    }

    this.totalBySpecies = Array.from(speciesMap.entries()).map(([species, count]) => ({ species, count }));
    this.totalByType = Array.from(typeMap.entries()).map(([type, count]) => ({ type, count }));
  }

setFavorite(character: any): void {
  if (this.favoriteCharacter && this.favoriteCharacter.id === character.id) {
    this.favoriteCharacter = null;
    this.snackBar.open('Favorito eliminado', 'Cerrar', { duration: 3000 });
  } else {
    this.favoriteCharacter = character;
    this.snackBar.open('Personaje marcado como favorito', 'Cerrar', { duration: 3000 });
  }
}

showFavoriteDetails(): void {
  alert(`
    Nombre: ${this.favoriteCharacter.name}
    Status: ${this.favoriteCharacter.status}
    Especie: ${this.favoriteCharacter.species}
    Género: ${this.favoriteCharacter.gender}
  `);
}


}
