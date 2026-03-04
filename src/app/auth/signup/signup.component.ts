import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null);
  }

  return of({ notUnique: true });
}
function mustContainQuestionMark(control: AbstractControl) {
  if (control.value && control.value.includes('?')) {
    return null;
  }

  return { doesNotContainQuestionMark: true };
}


@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsUnique]
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6), mustContainQuestionMark]
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      })
    }),
    firstName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      number: new FormControl('', {
        validators: [Validators.required]
      }),
      postalCode: new FormControl('', {
        validators: [Validators.required]
      }),
      city: new FormControl('', {
        validators: [Validators.required]
      })
    }),
    role: new FormControl<'student' | 'teacher' | 'employee' | 'founder' | 'other'>('student', {
      validators: [Validators.required]
    }),
    agree: new FormControl(false, {
      validators: [Validators.required]
    })
  });

  ngOnInit(): void {
    const subscription = this.form.valueChanges.pipe(debounceTime(1000)).subscribe({
      next: (value) => {
        window.localStorage.setItem(
          'saved-signup-form',
          JSON.stringify({ email: value.email })
        );
      }
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSubmit() {
    console.log(this.form.value.email, this.form.value.passwords?.password);
    console.log('Address ',this.form.value.address);
  }

  onReset() {
    this.form.reset();
  }

  get emailIsInvalid() {
    return this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid;
  }

  get passwordIsInvalid() {
    return this.form.controls.passwords.controls.password.touched &&
      this.form.controls.passwords.controls.password.dirty &&
      this.form.controls.passwords.controls.password.invalid;
  }
}
