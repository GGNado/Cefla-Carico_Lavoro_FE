import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  auth   = inject(AuthService);
  router = inject(Router);

  usernameOrEmail = '';
  password        = '';
  showPassword    = signal(false);
  loading         = signal(false);
  errorMsg        = signal('');

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (!this.usernameOrEmail || !this.password) {
      this.errorMsg.set('Inserisci email/username e password.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');

    this.auth.signin({ usernameOrEmail: this.usernameOrEmail, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Credenziali non valide. Riprova.');
      },
    });
  }
}
