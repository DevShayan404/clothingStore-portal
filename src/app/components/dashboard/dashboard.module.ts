import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LibraryModuleModule } from 'src/app/library-module/library-module.module';
import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardPipe } from '../dashboard.pipe';
import { CategoriesComponent } from '../categories/categories.component';
import { CategoryItemsComponent } from '../category-items/category-items.component';

@NgModule({
  declarations: [DashboardComponent, CategoriesComponent , DashboardPipe, CategoryItemsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LibraryModuleModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
})
export class DashboardModule {}
