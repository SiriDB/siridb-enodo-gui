export const VendorNames = Object.freeze({
    "WEBHOOK": "webhook",
    "SLACK": "slack",
    "MS_TEAMS": "ms_teams",
    "DUTYCALLS": "dutycalls"
});

export const EventTypes = Object.freeze({
    "ENODO_EVENT_ANOMALY_DETECTED": "event_anomaly_detected",
    "ENODO_EVENT_JOB_QUEUE_TOO_LONG": "job_queue_too_long",
    "ENODO_EVENT_LOST_CLIENT_WITHOUT_GOODBYE": "lost_client_without_goodbye"
});

export const EventSeverityLevels = Object.freeze({
    "ENODO_EVENT_SEVERITY_INFO": "info",
    "ENODO_EVENT_SEVERITY_WARNING": "warning",
    "ENODO_EVENT_SEVERITY_ERROR": "error"
});

export const EventOutputTypes = Object.freeze({
    "ENODO_EVENT_OUTPUT_WEBHOOK": 1
});