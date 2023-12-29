from celery.schedules import crontab

SCHEDULED_TASKS = {
    "heartbeat": {
        "schedule": 60 * 60 * 24,  # Every 1 day
        "task": "heartbeat",
    },
    "jobs_sync_breezy_details": {
        "schedule": crontab(minute="*/15"),  # = Every 15 minutes
        "task": "jobs_sync_breezy_details",
    },
    "jobs_sync_data": {
        "schedule": crontab(minute="*/5"),
        "task": "jobs_sync_data",
    },
    "jobs_sync_resumes": {
        "schedule": crontab(minute="*/60"),
        "task": "jobs_sync_resumes",
    },
    "jobs_sync_nominatim": {
        "schedule": crontab(minute="*/60"),
        "task": "jobs_sync_nominatim",
    },
    "jobs_sync_breezy": {
        "schedule": crontab(minute="*/30"),
        "task": "jobs_sync_breezy",
    },
    # "jobs_update_indexes": {
    #     "schedule": crontab(minute="0", hour="2"),  # = Every 04:00 with UTC +2
    #     "task": "jobs_update_indexes",
    # },
    "breezy_sync_webhooks": {
        "schedule": crontab(minute="*/20"),
        "task": "breezy_sync_webhooks",
    },
    "db_connections_cleanup": {
        "schedule": 60 * 60 * 24,  # Every 24hours
        "task": "db_connections_cleanup",
    },
}
