import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Form} from "../../models/form";
import {FormService} from "../../services/form.service";
import {Question, Type} from "../../models/question";
import {MatDialog} from "@angular/material/dialog";
import {QuestionService} from "../../services/question.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InformationComponent} from "../information/information.component";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";


@Component({
    templateUrl: './view-form.component.html',
    styleUrl: './view-form.component.css'
})
export class ViewFormComponent {
    id: string | undefined;
    form?: Form;
    isPublic: boolean | undefined;
    isReadOnly: boolean | undefined;
    readonly dialog = inject(MatDialog);
    protected readonly Type = Type;
    
    constructor(
        private route: ActivatedRoute,
        private formService: FormService,
        private questionService: QuestionService,
        public snackBar: MatSnackBar,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            this.formService.getById(this.id).subscribe((res) => {
                this.form = res;
                this.isPublic = res.isPublic;
                res.instances.length > 0 ? this.isReadOnly = true : this.isReadOnly = false;

                if (this.isReadOnly) {
                    const dialogRef = this.dialog.open(InformationComponent, {
                        data: {
                            text: "There are already answers for this form. You can only delete this form or manage sharing"
                        }
                    });
                }
            });
        }
    }

    refresh() {
        this.formService.getById(this.id!).subscribe((res) => {
            this.form = res;
            this.isPublic = res.isPublic;
        });
    }

    changeIdX(increase: boolean, question: Question) {
        if (increase) {
            question.idX++;
        } else {
            question.idX--;
        }

        this.questionService.changeIdx(question).subscribe(res => {
            if (!res) {
                this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', {duration: 10000});
            }
            this.refresh();
        });
    }

    tooglePublic() {
        if (this.form) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: this.form.isPublic ? 'Make form private' : 'Make form public',
                    message: this.form.isPublic ? 'Are you sure you want to make this form private? You will need to share this form again to allow \'Users\' access to other users.' : 'Are you sure you want to make this form public? This will delete all existing shared with \'Users\' access to this form.'
                }
            });

            dialogRef.afterClosed().subscribe(res => {
                if (res === 'confirm') {
                    let f = this.form!;
                    f.isPublic = !this.form!.isPublic;

                    this.formService.update(f).subscribe(res => {
                        if (!res) {
                            this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', {duration: 10000});
                        }
                        this.refresh();
                    });
                }
            });
        }
    }

    openDialogDeleteQuestion(question: Question) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete question',
                message: 'Are you sure you want to delete this question: ' + question.title + ' ?'
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res == 'confirm') {
                this.questionService.deleteById(question.id).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', {duration: 10000});
                    }
                    this.refresh();
                });
            }
        });
    }
    openAddEditQuestion(formId:any, questionId?: number): void {
        if (questionId) {
            // Si un ID de question est fourni, naviguer vers l'édition
            this.router.navigate(['/add-edit-question', formId, questionId]);
        } else {
            // Si aucun ID n'est fourni, naviguer vers l'ajout d'une nouvelle question
            this.router.navigate(['/add-edit-question', formId]);
        }
    }

    deleteForm() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete form',
                message: 'Are you sure you want to delete this form? This action is irreversible.'
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res === 'confirm') {
                this.formService.deleteById(this.form!.id).subscribe(res => {
                    if (!res) {
                        if (this.snackBar) {
                            this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', {duration: 10000});
                        } else {
                            console.error(`There was an error at the server. The update has not been done! Please try again.`);
                        }
                    } else {
                        this.router.navigate(['/']);
                    }
                });
            }
        });
    }

    openAddForm(formId: number | undefined) {
        if (formId) {
            // Si un ID de form est fourni, naviguer vers l'édition
            this.router.navigate(['/add-form', formId]);
        }
    }

    openManageShares(formId: number | undefined) {
        if (formId) {
            // Si un ID de form est fourni, naviguer vers la gestion des access
            this.router.navigate(['/manage-shares', formId]);
        }
    }
}