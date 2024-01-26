
import { Schema, model, Document } from 'mongoose';


const ContractSubsystemReport = new Schema({
    contractSystem: {
        type:Schema.Types.ObjectId,
    },
    anomalies: {
        type: [{
            _id: {
                type:Schema.Types.ObjectId,
            },
            anomaly: {
                type: Schema.Types.Mixed,
            },
            solutions: {
                type: Schema.Types.Mixed,
            },
            photoUrls: {
                type: Schema.Types.Mixed,
                /*type: [{
                    url: String,
                    date: Date
                }],
                default: undefined*/
            },
            materials: {
                type: Schema.Types.Mixed,
            },
            corrective: {
                report: {
                    type: Schema.Types.ObjectId,
                    ref: 'reports'
                },
                done: Boolean
            }
        }],
        default: undefined
    },
    lastRevision: Date,
    reviewed: Boolean
})



const CalendarEvent =  new Schema({
    startTime: String,
    endTime: String,
    daysOfWeek: {
        type: [Number],
        default: undefined
    },
    start: Date,
    end: Date,
});

const Schedule = new Schema({
    startTime: Date,
    endTime: Date,
});

const InstalledWorkMaterial = model('InstalledWorkMaterial', new Schema({
    material: {
        type: Schema.Types.ObjectId,
        ref: 'materials'
    }
}))

const InstalledWorkSubsystem = model('InstalledWorkSubsystem', new Schema({
    subsystem: {
        type: Schema.Types.ObjectId,
        ref: 'subsystems'
    }
}))

const InstalledWorkItem = new Schema({
    name: String,
    itemType: {
        type: String,
        enum: [InstalledWorkMaterial, InstalledWorkSubsystem]
    },
    data: {
        type: Schema.Types.ObjectId,
        refPath: 'itemType'
    },
    observations: String,
    photoUrls: {
        type: [String],
        default: undefined
    },
    installed: Number
});

const MaintenanceReport = new Schema({
    contractSubsystems: {
        default: undefined,
        type: [ContractSubsystemReport],
    },
    date: Date,
    lastModification: Date,
    worker: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    observations: String,
    tasks:{
        default: undefined,
        type: [{
            task: {
                type: Schema.Types.ObjectId,
                ref: 'tasks',
            },
            done: Boolean
        }]
    }
})

const CorrectiveReport = new Schema({
    reports: {
        type: [{
            report: {
                type: Schema.Types.ObjectId,
                ref: 'reports',
                required: [true, 'report is required']
            },
            contractSubsystems: {
                default: undefined,
                type: [ContractSubsystemReport],
            }
        }],
        default: undefined
    },
    date: Date,
    lastModification: Date,
    observations: String,
    tasks:{
        default: undefined,
        type: [{
            task: {
                type: Schema.Types.ObjectId,
                ref: 'tasks',
            },
            done: Boolean
        }]
    }
})

const AssistanceReport = new Schema({
    contractSubsystems: {
        default: undefined,
        type: [ContractSubsystemReport],
    },
    date: Date,
    lastModification: Date,
    worker: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    observations: String,
    tasks:{
        default: undefined,
        type: [{
            task: {
                type: Schema.Types.ObjectId,
                ref: 'tasks',
            },
            done: Boolean
        }]
    }
})

const WorkReport = new Schema({
    work: {
        type: Schema.Types.ObjectId,
        ref: 'works',
        required: true
    },
    eventsScheduled: {
        type: [{
            date: Date,
            workItems: [InstalledWorkItem],
            checkins: {
                type: Schema.Types.ObjectId,
                ref: 'checkins'
            },
        }],
        default: undefined
    }
})

const ReportSchema = new Schema({
    title: {
        type: String,
        // required: [true, 'title is required']
    },
    description: {
        type: String,
        //required: [true, "description is required"]
    },
    startTime: {
        type: Number,
        required: [true, 'startTime is required'],
    },
    endTime: {
        type: Number,
        required: [true, 'endTime is required']
    },
    createdDate: {
        type: Number,
        required: [true, 'createdDate is required']
    },
    workersId: [{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'workersId is required']
    }],
    tools: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'materials',
        }],
        default: undefined
    },
    type: {
        type: String,
        enum: ['work', 'maintenance', 'assistance', 'corrective'],
        required: [true, 'type is required']
    },
    status: {
        type: String,
        enum: ['pending', 'done', 'paused', 'doing'],// este último no se salva en la BD, depende solo de si hay un checkin activo, sin checkout
 
        required: [true, 'status is required']
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'customers',
        required: [true, 'customerId is required']
    },
    contractId: {
        type: Schema.Types.ObjectId,
        ref: 'contracts',
        //required: [true, 'contractId is required']
    },
    routeId: {
        type: Schema.Types.ObjectId,
        ref: 'routes',
    },
    number:{
        type: Number,
        // required: [true, 'number is required']
    },
    checkins: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'checkins'
        }],
       // default: undefined
    },
    lastModification: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    vehicle: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'vehicles'
        }],
        default: undefined
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    budgetFile: String,
    photoUrls: {
        type: [String],
        default: undefined   
    },
    alertDate: Number,
    events: {
        type: [CalendarEvent],
        default: undefined
    },
    schedules: {
        type: [Schedule],
        default: undefined
    },
    maintenanceReport: MaintenanceReport,
    assistanceReport: AssistanceReport,
    correctiveReport: CorrectiveReport,
    workReport: WorkReport,
    documents: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }],
});



export interface ICheckin extends Document {
    checkin: {
        startTime: number;
        ubication: {
            lat: number;
            long: number;
        };
    };
    checkout: {
        startTime: number;
        ubication: {
            lat: number ,
            long: number 
        },
    };
    userId: Schema.Types.ObjectId;
    reportId: Schema.Types.ObjectId;
    
}

export const Checkin = model<ICheckin>('Checkin', ReportSchema);