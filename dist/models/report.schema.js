"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkin = void 0;
const mongoose_1 = require("mongoose");
const ContractSubsystemReport = new mongoose_1.Schema({
    contractSystem: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    anomalies: {
        type: [{
                _id: {
                    type: mongoose_1.Schema.Types.ObjectId,
                },
                anomaly: {
                    type: mongoose_1.Schema.Types.Mixed,
                },
                solutions: {
                    type: mongoose_1.Schema.Types.Mixed,
                },
                photoUrls: {
                    type: mongoose_1.Schema.Types.Mixed,
                    /*type: [{
                        url: String,
                        date: Date
                    }],
                    default: undefined*/
                },
                materials: {
                    type: mongoose_1.Schema.Types.Mixed,
                },
                corrective: {
                    report: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: 'reports'
                    },
                    done: Boolean
                }
            }],
        default: undefined
    },
    lastRevision: Date,
    reviewed: Boolean
});
const CalendarEvent = new mongoose_1.Schema({
    startTime: String,
    endTime: String,
    daysOfWeek: {
        type: [Number],
        default: undefined
    },
    start: Date,
    end: Date,
});
const Schedule = new mongoose_1.Schema({
    startTime: Date,
    endTime: Date,
});
const InstalledWorkMaterial = (0, mongoose_1.model)('InstalledWorkMaterial', new mongoose_1.Schema({
    material: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'materials'
    }
}));
const InstalledWorkSubsystem = (0, mongoose_1.model)('InstalledWorkSubsystem', new mongoose_1.Schema({
    subsystem: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'subsystems'
    }
}));
const InstalledWorkItem = new mongoose_1.Schema({
    name: String,
    itemType: {
        type: String,
        enum: [InstalledWorkMaterial, InstalledWorkSubsystem]
    },
    data: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'itemType'
    },
    observations: String,
    photoUrls: {
        type: [String],
        default: undefined
    },
    installed: Number
});
const MaintenanceReport = new mongoose_1.Schema({
    contractSubsystems: {
        default: undefined,
        type: [ContractSubsystemReport],
    },
    date: Date,
    lastModification: Date,
    worker: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users'
    },
    observations: String,
    tasks: {
        default: undefined,
        type: [{
                task: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'tasks',
                },
                done: Boolean
            }]
    }
});
const CorrectiveReport = new mongoose_1.Schema({
    reports: {
        type: [{
                report: {
                    type: mongoose_1.Schema.Types.ObjectId,
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
    tasks: {
        default: undefined,
        type: [{
                task: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'tasks',
                },
                done: Boolean
            }]
    }
});
const AssistanceReport = new mongoose_1.Schema({
    contractSubsystems: {
        default: undefined,
        type: [ContractSubsystemReport],
    },
    date: Date,
    lastModification: Date,
    worker: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users'
    },
    observations: String,
    tasks: {
        default: undefined,
        type: [{
                task: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'tasks',
                },
                done: Boolean
            }]
    }
});
const WorkReport = new mongoose_1.Schema({
    work: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'works',
        required: true
    },
    eventsScheduled: {
        type: [{
                date: Date,
                workItems: [InstalledWorkItem],
                checkins: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'checkins'
                },
            }],
        default: undefined
    }
});
const ReportSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'users',
            required: [true, 'workersId is required']
        }],
    tools: {
        type: [{
                type: mongoose_1.Schema.Types.ObjectId,
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
        enum: ['pending', 'done', 'paused', 'doing'],
        required: [true, 'status is required']
    },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'customers',
        required: [true, 'customerId is required']
    },
    contractId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contracts',
        //required: [true, 'contractId is required']
    },
    routeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'routes',
    },
    number: {
        type: Number,
        // required: [true, 'number is required']
    },
    checkins: {
        type: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'checkins'
            }],
        // default: undefined
    },
    lastModification: {
        type: String,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users'
    },
    vehicle: {
        type: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'vehicles'
            }],
        default: undefined
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.Checkin = (0, mongoose_1.model)('Checkin', ReportSchema);
