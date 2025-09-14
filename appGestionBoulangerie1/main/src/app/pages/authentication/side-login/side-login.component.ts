import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-side-login',
  standalone: true, // 👈 si tu veux standalone
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {

  constructor(private router: Router, private http: HttpClient) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    console.log(this.form.value); // 👀 debug: voir si les champs remontent

    if (this.form.invalid) {
      alert('Veuillez remplir correctement le formulaire');
      return;
    }

    const payload = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.http.post<any>('http://localhost:8000/api/login', payload)
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.user.role);
          localStorage.setItem('user', JSON.stringify(res.user));


            console.log('ID du user connecté:', res.user.id);

          switch (res.user.role.toUpperCase()) {
            case 'ADMIN': this.router.navigate(['/admin/dashboard']); break;
            case 'CLIENT': this.router.navigate(['/client/dashboard']); break;
            case 'GESTIONNAIRE': this.router.navigate(['/gestionnaire/dashboard']); break;
            case 'LIVREUR': this.router.navigate(['/livreur/dashboard']); break;

            default: this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error(err);
          alert('Email ou mot de passe incorrect');
        }
      });
  }
}
