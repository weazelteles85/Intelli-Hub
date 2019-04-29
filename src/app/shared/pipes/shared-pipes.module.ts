import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeScriptPipe } from './safe-script.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [SafeScriptPipe]
})
export class SharedPipesModule { }
