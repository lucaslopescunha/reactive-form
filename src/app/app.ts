import { Component, signal } from '@angular/core';
import { SignupComponent } from './auth/signup/signup.component';

@Component({
  selector: 'app-root',
  imports: [ SignupComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('reactive-form');
}
