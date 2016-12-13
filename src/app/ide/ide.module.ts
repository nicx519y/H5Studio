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
import { AttrFormComponent } from '../attr-form/attr-form.component';
import { AttrsComponent } from '../attrs/attrs.component';
import { PanelComponent } from '../panel/panel.component';
import { CanvasComponent } from '../canvas/canvas.component';
import { PreviewerComponent } from '../previewer/previewer.component';
import { HotKeysComponent } from '../hot-keys/hot-keys.component';
import { ModalComponent } from '../modal/modal.component';
import { BitmapImporterComponent } from '../bitmap-importer/bitmap-importer.component';
import { PageListComponent } from '../page-list/page-list.component';
import { ItemListComponent } from '../item-list/item-list.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { LayerComponent } from '../layer/layer.component';
import { ToolsbarComponent } from '../toolsbar/toolsbar.component';
import { PageConfigerComponent } from '../page-configer/page-configer.component';
import { TimelineRulerComponent } from '../timeline-ruler/timeline-ruler.component';
import { OnionSkinComponent } from '../onion-skin/onion-skin.component';

import { MainService } from '../main.service';
import { TimelineService } from '../timeline.service';
import { ItemsService } from '../items.service';
import { PagesService } from '../pages.service';
import { AttrsService } from '../attrs.service';
import { BitmapImporterService } from '../bitmap-importer.service';
import { PageConfigerService } from '../page-configer.service';

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
		AttrFormComponent,
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
		TimelineRulerComponent,
		OnionSkinComponent,
	],
	providers: [
		MainService,
		TimelineService,
		AttrsService,
		ItemsService,
		PagesService,
		BitmapImporterService,
		PageConfigerService,
	],
	exports: [
		IdeComponent
	]
})
export class IdeModule { }
