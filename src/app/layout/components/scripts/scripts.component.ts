import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Renderer2, Inject, SecurityContext, Renderer, Sanitizer } from '@angular/core';
declare let swal: any;
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss']
})
export class ScriptsComponent implements OnInit, AfterViewInit {

  htmlSnippet: string = ``;
  @ViewChild('element') public viewElement: ElementRef;
  public element: any;

  @Input() src: string;
  @Input() type: string;
  @ViewChild('htmlSnippet') html;

  constructor(public renderer: Renderer2, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.html = '<h2>test</h2>'
  }

  ngAfterViewInit() {
  }



}
