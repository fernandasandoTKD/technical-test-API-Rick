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
    MatIconModule
  ],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  private characterService = inject(CharacterService);

  // Filtros
  nameControl = new FormControl('');
  statusControl = new FormControl('');
  statuses = ['alive', 'dead', 'unknown'];

  // Tabla
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ['name', 'status', 'species', 'type', 'gender', 'created', 'actions'];

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
}
