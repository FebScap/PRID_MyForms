import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {FormService} from "../../services/form.service";
import {Form} from "../../models/form";
import {MatSelectChange} from "@angular/material/select";
import {MatTable} from "@angular/material/table";

@Component({
    selector: 'app-analyze',
    templateUrl: './analyze.component.html',
})
export class AnalyzeComponent {
    id: string | undefined;
    form?: Form;
    dataSource: any[] = [];
    displayedColumns: string[] = ["answer", "count", "ratio"];
    @ViewChild(MatTable) table!: MatTable<any>;

    constructor(
        private route: ActivatedRoute,
        private formService: FormService,
    ) {

    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            this.formService.getById(this.id).subscribe((res) => {
                this.form = res;
            });
        }
    }

    changedSelection($event: MatSelectChange) {
        this.dataSource = [];
        this.formService.analyze(Number(this.id), $event.value).subscribe((res) => {
            res.forEach((item: any) => {
                if (this.dataSource.find((i: any) => i.value === item.value)) {
                    this.dataSource.find((i: any) => i.value === item.value).count++;
                } else {
                    this.dataSource.push({
                        value: item.value,
                        count: 1
                    });
                }
            });
            
            this.dataSource.forEach((item: any) => {
                item.ratio = item.count / res.length;
            });
            
            this.dataSource.sort((a, b) => b.count - a.count || a.value.localeCompare(b.value) || a.value - b.value);
            
            this.table.renderRows();
        });
    }
}