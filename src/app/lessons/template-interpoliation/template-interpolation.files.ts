import { FileSystemTree } from '@webcontainer/api';

export const files: FileSystemTree = {
  src: {
    directory: {
      'interpolation.html': {
        file: {
          contents: `<div>Hello {{ name }}!</div>`
        }
      },
      'main.ts': {
        file: {
          contents: `import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  standalone: true,
  templateUrl: 'interpolation.html'
})
export class App {
  name = 'world';
}

bootstrapApplication(App);`
        }
      },
      'index.html': {
        file: {
          contents: `
          <html>
          <head>
            <title>My app</title>
          </head>
          <body>
            <my-app>Loading...</my-app>
          </body>
        </html>
        
          `
        }
      },
      'global_styles.css': {
        file: {
          contents: ``
        }
      }
    }
  },

  'angular.json': {
    file: {
      contents: `
      {
        "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
        "version": 1,
        "newProjectRoot": "projects",
        "projects": {
          "demo": {
            "root": "",
            "sourceRoot": "src",
            "projectType": "application",
            "prefix": "app",
            "schematics": {},
            "architect": {
              "build": {
                "builder": "@angular-devkit/build-angular:browser",
                "options": {
                  "outputPath": "dist/demo",
                  "index": "src/index.html",
                  "main": "src/main.ts",
                  "polyfills": ["zone.js"],
                  "tsConfig": "tsconfig.json",
                  "styles": ["src/global_styles.css"]
                },
                "configurations": {
                  "development": {
                    "buildOptimizer": false,
                    "optimization": false,
                    "vendorChunk": true,
                    "extractLicenses": false,
                    "sourceMap": false,
                    "namedChunks": true
                  }
                }
              },
              "serve": {
                "builder": "@angular-devkit/build-angular:dev-server",
                "options": {
                  "browserTarget": "demo:build"
                },
                "configurations": {
                  "development": {
                    "browserTarget": "demo:build:development",
                  }
                },
                "defaultConfiguration": "development"
              }
            }
          }
        },
        "defaultProject": "demo"
      }      
      `
    }
  },
  'package.json': {
    file: {
      contents: `
        {
          "name": "just.angular.1",
          "version": "0.0.0",
          "private": true,
          "scripts": {
            "ng": "ng",
            "start": "ng serve --hmr"
          },
          "dependencies": {
            "@angular/animations": "^15.1.2",
            "@angular/common": "^15.1.2",
            "@angular/compiler": "^15.1.2",
            "@angular/core": "^15.1.2",
            "@angular/forms": "^15.1.2",
            "@angular/platform-browser": "^15.1.2",
            "@angular/platform-browser-dynamic": "^15.1.2",
            "@angular/router": "^15.1.2",
            "rxjs": "^7.8.0",
            "tslib": "^2.5.0",
            "zone.js": "^0.12.0"
          },
          "devDependencies": {
            "@angular-devkit/build-angular": "^15.1.6",
            "@angular/cli": "~15.1.6",
            "@angular/compiler-cli": "^15.1.0",
            "typescript": "~4.9.4"
          }
        }
        `,
    },
  },
  'tsconfig.json': {
    file: {
      contents: `
        {
          "compileOnSave": false,
          "compilerOptions": {
            "baseUrl": "./",
            "outDir": "./dist/out-tsc",
            "sourceMap": true,
            "declaration": false,
            "downlevelIteration": true,
            "experimentalDecorators": true,
            "module": "esnext",
            "moduleResolution": "node",
            "importHelpers": true,
            "target": "es2015",
            "typeRoots": ["node_modules/@types"],
            "lib": ["es2018", "dom"]
          },
          "angularCompilerOptions": {
            "strictTemplates": true,
            "strictInjectionParameters": true
          }
        }        
        `,
    },
  },
};
