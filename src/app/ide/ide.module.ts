import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AppCommonModule } from '../app-common/app-common.module';

import { IdeComponent } from './ide.component';
import { AccordionComponent } from '../accordion/accordion.component';
import { IdeLayoutComponent } from '../ide-layout/ide-layout.component';
import { PanelComponent } from '../panel/panel.component';
import { PreviewerComponent } from '../previewer/previewer.component';
import { ModalComponent } from '../modal/modal.component';

import { PageListComponent } from '../page-list/page-list.component';
import { PagesService } from '../pages.service';

import { ItemListComponent } from '../item-list/item-list.component';
import { ItemsService } from '../items.service';

import { BitmapImporterComponent } from '../bitmap-importer/bitmap-importer.component';
import { BitmapImporterService } from '../bitmap-importer.service';

import { LayerComponent } from '../layer/layer.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { TimelineRulerComponent } from '../timeline-ruler/timeline-ruler.component';
import { TimelineService } from '../timeline.service';

import { OnionSkinComponent } from '../onion-skin/onion-skin.component';
import { ToolsbarComponent } from '../toolsbar/toolsbar.component';
import { CanvasComponent } from '../canvas/canvas.component';

import { PageConfigerComponent } from '../page-configer/page-configer.component';
import { PageConfigerService } from '../page-configer.service';

import { AttrFormComponent } from '../attr-form/attr-form.component';
// import { AttrsComponent } from '../attrs/attrs.component';
// import { AttrsService } from '../attrs.service';
// import { HotKeysComponent } from '../hot-keys/hot-keys.component';

// import { MainService } from '../main.service';

const ROUTES: Routes = [
	{path: 'studio', component: IdeComponent}
];

@NgModule({
	imports: [
		RouterModule.forChild(ROUTES),
		CommonModule,
		FormsModule,
		HttpModule,
		AppCommonModule,
		Ng2BootstrapModule,
	],
	declarations: [
		IdeComponent,
		AccordionComponent,
		IdeLayoutComponent,
		PanelComponent,
		PreviewerComponent,
		PageListComponent,
		ModalComponent,
		BitmapImporterComponent,
		ItemListComponent,
		LayerComponent,
		TimelineComponent,
		TimelineRulerComponent,
		OnionSkinComponent,
		ToolsbarComponent,
		CanvasComponent,
		PageConfigerComponent,
		AttrFormComponent,
		// AttrsComponent,
		// HotKeysComponent,
	],
	providers: [
		// MainService,
		ItemsService,
		PagesService,
		BitmapImporterService,
		TimelineService,
		PageConfigerService,
		// AttrsService,
	],
	exports: [
		IdeComponent
	]
})
export class IdeModule { }
