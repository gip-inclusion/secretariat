interface Relationship {
    incubator: {
        data: {
            type: string,
            id: string
        }
    }
}

export const PHASE_READABLE_NAME = {
    'acceleration': 'En Accélération',
    'investigation': 'En Investigation',
    'transfert': 'Transférée',
    'construction': 'En Construction',
    'alumni': 'Partenariat terminé',
    'success': 'Pérennisé'
}

export enum StartupPhase {
    PHASE_INVESTIGATION="investigation",
    PHASE_CONSTRUCTION="construction",
    PHASE_ACCELERATION="acceleration",
    PHASE_TRANSFER="transfer",
    PHASE_SUCCESS="success",
    PHASE_ALUMNI="alumni",
}

export const ACTIVE_PHASES = [
    StartupPhase.PHASE_ACCELERATION,
    StartupPhase.PHASE_CONSTRUCTION,
    StartupPhase.PHASE_INVESTIGATION
]

export interface Startup {
    github?:string
    website?: string
    dashlord_url?: string
    id: string;
    name: string;
    repository: string;
    contact: string;
    expired_members: string[];
    active_members: string[];
    previous_members: string[];
    phases: Phase[]
}

export interface StartupInfo {
    id: string;
    attributes: {
        github: string
        dashlord_url: string
        website: any
        name: string
        repository: string;
        contact: string;
        expired_members: string[];
        active_members: string[];
        previous_members: string[];
        pitch: string;
        stats_url: string;
        link: string;
        incubator: string;
        phases: Phase[];
        content_url_encoded_markdown: string;
    };
    relationships: Relationship;
}

export interface Phase {
    name: StartupPhase;
    start: Date;
    end?: Date;
}

export interface DBStartup {
    mailing_list?: string;
    id: string;
    name: string;
    pitch: string;
    stats_url: string;
    link: string;
    repository: string;
    contact: string;
    phases: Phase[];
    current_phase: StartupPhase;
    current_phase_date: Date;
    incubator: string;
}
