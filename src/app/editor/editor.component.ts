import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../script.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor(private Script: ScriptService ) {
    this.Script.load('editorInit');
   }

  ngOnInit() {

  }

}
