export const VendorNames = Object.freeze({
    "WEBHOOK": "webhook",
    "SLACK": "slack",
    "MS_TEAMS": "ms_teams",
    "DUTYCALLS": "dutycalls",
    "SENTRY": "sentry"
});

export const EventTypes = Object.freeze({
    "ENODO_EVENT_ANOMALY_DETECTED": "event_anomaly_detected",
    "ENODO_EVENT_JOB_QUEUE_TOO_LONG": "job_queue_too_long",
    "ENODO_EVENT_LOST_CLIENT_WITHOUT_GOODBYE": "lost_client_without_goodbye",
    "ENODO_EVENT_STATIC_RULE_FAIL": "event_static_rule_fail"
});

// Make sure to edit the Sentry payload when these levels are changed
export const EventSeverityLevels = Object.freeze({
    "ENODO_EVENT_SEVERITY_INFO": "info",
    "ENODO_EVENT_SEVERITY_WARNING": "warning",
    "ENODO_EVENT_SEVERITY_ERROR": "error"
});

export const EventOutputTypes = Object.freeze({
    "ENODO_EVENT_OUTPUT_WEBHOOK": 1
});

export const JobTypes = Object.freeze({
    "JOB_BASE_ANALYSIS": "job_base_analysis",
    "JOB_FORECAST": "job_forecast",
    "JOB_ANOMALY_DETECT": "job_anomaly_detect",
    "JOB_STATIC_RULES": "job_static_rules"
});

export const JobScheduleTypes = Object.freeze({
    "POINTS": "N",
    "SECONDS": "TS"
});