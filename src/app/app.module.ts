import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { AccordionComponent } from './accordion/accordion.component';
import { LayoutComponent } from './layout/layout.component';
import { AttrFormComponent } from './attr-form/attr-form.component';
import { NavComponent } from './nav/nav.component';
import { AttrsComponent } from './attrs/attrs.component';
import { PanelComponent } from './panel/panel.component';
import { CanvasComponent } from './canvas/canvas.component';
import { PreviewerComponent } from './previewer/previewer.component';
import { HotKeysComponent } from './hot-keys/hot-keys.component';
import { ModalComponent } from './modal/modal.component';
import { BitmapImporterComponent } from './bitmap-importer/bitmap-importer.component';
import { PageListComponent } from './page-list/page-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { TimelineComponent } from './timeline/timeline.component';
import { LayerComponent } from './layer/layer.component';
import { ToolsbarComponent } from './toolsbar/toolsbar.component';
import { PageConfigerComponent } from './page-configer/page-configer.component';
import { TimelineRulerComponent } from './timeline-ruler/timeline-ruler.component';

@NgModule({
  declarations: [
    AppComponent,
    AccordionComponent,
    LayoutComponent,
    AttrFormComponent,
    NavComponent,
    AttrsComponent,
    PanelComponent,
    CanvasComponent,
    PreviewerComponent,
    HotKeysComponent,
    ModalComponent,
    BitmapImporterComponent,
    PageListComponent,
    ItemListComponent,
    TimelineComponent,
    LayerComponent,
    ToolsbarComponent,
    PageConfigerComponent,
    TimelineRulerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
