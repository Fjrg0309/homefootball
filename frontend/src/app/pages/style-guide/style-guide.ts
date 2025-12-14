import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/layout/header/header';
import { Button } from '../../components/shared/button/button';
import { Card } from '../../components/shared/card/card';
import { FormInput } from '../../components/shared/form-input/form-input';
import { FormTextarea } from '../../components/shared/form-textarea/form-textarea';
import { FormSelect, SelectOption } from '../../components/shared/form-select/form-select';
import { FormCheckbox } from '../../components/shared/form-checkbox/form-checkbox';
import { FormRadioGroup, RadioOption } from '../../components/shared/form-radio-group/form-radio-group';
import { Alert } from '../../components/shared/alert/alert';
import { Badge } from '../../components/shared/badge/badge';
import { DataTable, TableColumn, TableData } from '../../components/shared/data-table/data-table';
import { Pagination } from '../../components/shared/pagination/pagination';

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Button,
    Card,
    FormInput,
    FormTextarea,
    FormSelect,
    FormCheckbox,
    FormRadioGroup,
    Alert,
    Badge,
    DataTable,
    Pagination
  ],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss',
})
export class StyleGuide {
  // Form select options
  selectOptions: SelectOption[] = [
    { value: 'laliga', label: 'LaLiga' },
    { value: 'premier', label: 'Premier League' },
    { value: 'serie-a', label: 'Serie A' }
  ];

  // Radio options
  radioOptions: RadioOption[] = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'other', label: 'Otro' }
  ];

  // Table columns
  tableColumns: TableColumn[] = [
    { key: 'equipo', label: 'Equipo', sortable: true },
    { key: 'puntos', label: 'Puntos', sortable: true, type: 'number' },
    { key: 'partidos', label: 'PJ', sortable: true, type: 'number' },
    { key: 'estado', label: 'Estado', sortable: false, type: 'badge' }
  ];

  // Table data
  tableData: TableData[] = [
    { equipo: 'FC Barcelona', puntos: 45, partidos: 18, estado: 'Activo' },
    { equipo: 'Real Madrid', puntos: 42, partidos: 18, estado: 'Activo' },
    { equipo: 'Atlético Madrid', puntos: 38, partidos: 18, estado: 'Activo' },
    { equipo: 'Real Sociedad', puntos: 35, partidos: 18, estado: 'Activo' },
    { equipo: 'Villarreal', puntos: 32, partidos: 18, estado: 'Lesionado' }
  ];

  // Pagination
  currentPage: number = 1;
  totalPages: number = 10;

  onPageChange(page: number): void {
    this.currentPage = page;
    console.log('Página actual:', page);
  }
}
