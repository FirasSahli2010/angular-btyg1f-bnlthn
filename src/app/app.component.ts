import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { pairwise, tap, startWith, map, delay } from 'rxjs/operators';

// https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
function arrDiff(a1, a2) {
  let a = [], diff = [];
  for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
  }

  for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
          delete a[a2[i]];
      } else {
          a[a2[i]] = true;
      }
  }

  for (var k in a) { diff.push(k); }

  return diff;
}

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html',
})
export class AppComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [{
    fieldGroupClassName: 'row', fieldGroup: [{
      className: 'col-7 titre_modules', key: 'modules', type: 'radio', templateOptions: {
        type: 'array',
        label: 'Modules',
        options: of([
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' },
          { value: '4', label: 'Option 4' },
        ]).pipe(delay(50)),
      },
    }, {
      className: 'col-5 titre_modules', key: 'roles', type: 'multicheckbox',
      templateOptions: {
        label: 'Roles', options: [], type: 'array',
      },
      hooks: { onInit: (field) => {
        const form = field.parent.formControl;
        form.get('modules').valueChanges.pipe(startWith(form.get('modules').value), tap(modulesId => {
          if (modulesId && modulesId.length != 0) {
            field.templateOptions.options = of([
              { value: modulesId + '1', label: 'Option 1' },
              { value: modulesId + '2', label: 'Option 2' },
              { value: modulesId + '3', label: 'Option 3' },
              { value: modulesId + '4', label: 'Option 4' },
            ]).pipe(delay(1000));
          } else {
            field.templateOptions.options = [];
          }
        }),).subscribe();
        form.get('roles').valueChanges.pipe(
            startWith( form.get('roles').value),
            pairwise(),
            map(([a1, a2]) => {
              const diff = this.arrDiff(a1 || [], a2 || []);
                return diff.reduce((v, d) => {
                v[d] = a2.includes(d);
                return v;
              }, {});
            }),
            tap(v => console.warn(v))
          ).subscribe();
        },
      },
    }],
  },];
  arrDiff(a1, a2) {
    if(a1 && a2 ) {
      let a = [], diff = [];
      for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
      }

      for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
          delete a[a2[i]];
        } else {
          a[a2[i]] = true;
        }
      }

      for (var k in a) {
        diff.push(k);
      }

      return diff;
    }
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */