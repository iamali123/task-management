/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { TasksService } from '../../../../demo/service/TasksService';
import { Demo } from '@/types';

const Tasks = () => {

    let emptyTask: Demo.Task = {
        id: 0,
        name: '',
        image: '',
        description: '',
        startDate: '',
        endDate: '',
        members: [],
        completed: false,
        status: '',
        comments: '',
        attachments: '',
    };

    const [tasks, setTasks] = useState(null);
    const [taskDialog, setTaskDialog] = useState(false);
    const [deleteTaskDialog, setDeleteTaskDialog] = useState(false);
    const [deleteTasksDialog, setDeleteTasksDialog] = useState(false);
    const [task, setTask] = useState<Demo.Task>(emptyTask);
    const [selectedTasks, setSelectedTasks] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        TasksService.getTasks().then((data) => setTasks(data as any));
    }, []);

    const openNew = () => {
        setTask(emptyTask);
        setSubmitted(false);
        setTaskDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTaskDialog(false);
    };

    const hideDeleteTaskDialog = () => {
        setDeleteTaskDialog(false);
    };

    const hideDeleteTasksDialog = () => {
        setDeleteTasksDialog(false);
    };

    const saveTask = () => {
        setSubmitted(true);

        if (task.name.trim()) {
            let _tasks = [...(tasks as any)];
            let _task = { ...task };
            if (task.id) {
                const index = findIndexById(task.id);

                _tasks[index] = _task;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Task Updated',
                    life: 3000
                });
            } else {
                _task.id = createId();
                _tasks.push(_task);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Task Created',
                    life: 3000
                });
            }

            setTasks(_tasks as any);
            setTaskDialog(false);
            setTask(emptyTask);
        }
    };

    const editTask = (task: Demo.Task) => {
        setTask({ ...task });
        setTaskDialog(true);
    };

    const confirmDeleteTask = (task: Demo.Task) => {
        setTask(task);
        setDeleteTasksDialog(true);
    };

    const deleteTask = () => {
        let _tasks = (Tasks as any)?.filter((val: any) => val.id !== task.id);
        setTasks(_tasks);
        setDeleteTaskDialog(false);
        setTask(emptyTask);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Tasks Deleted',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (tasks as any)?.length; i++) {
            if ((tasks as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteTasksDialog(true);
    };

    const deleteSelectedTasks = () => {
        let _tasks = (tasks as any)?.filter((val: any) => !(selectedTasks as any)?.includes(val));
        setTasks(_tasks);
        setDeleteTasksDialog(false);
        setSelectedTasks(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Taskss Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _task = { ...task };
        _task[`${name}`] = val;

        setTask(_task);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedTasks || !(selectedTasks as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Task) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Task) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`/demo/images/Tasks/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Task) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`task-badge status-${rowData.status?.toLowerCase()}`}>{rowData.status}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Task) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editTask(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteTask(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Tasks</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const taskDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveTask} />
        </>
    );
    const deleteTaskDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteTaskDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteTask} />
        </>
    );
    const deleteTasksDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteTasksDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedTasks} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={tasks}
                        selection={selectedTasks}
                        onSelectionChange={(e) => setSelectedTasks(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Taskss"
                        globalFilter={globalFilter}
                        emptyMessage="No Taskss found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={taskDialog} style={{ width: '450px' }} header="Tasks Details" modal className="p-fluid" footer={taskDialogFooter} onHide={hideDialog}>
                        {task.image && <img src={`/demo/images/Tasks/${task.image}`} alt={task.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={task.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !task.name
                                })}
                            />
                            {submitted && !task.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={task.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTaskDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTaskDialogFooter} onHide={hideDeleteTaskDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {task && (
                                <span>
                                    Are you sure you want to delete <b>{task.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTasksDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTasksDialogFooter} onHide={hideDeleteTasksDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {task && <span>Are you sure you want to delete the selected Tasks?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
