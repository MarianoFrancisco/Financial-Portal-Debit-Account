import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { LayoutComponent } from './components/layout/layout.component';



@NgModule({
  declarations: [
    LoadingComponent,
    LayoutComponent
  ],
  exports: [
    LoadingComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
