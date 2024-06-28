import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './helpers/auth/http-request.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    MatSnackBarModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [provideAnimationsAsync(), httpInterceptorProviders],
})
export class AppModule {}
