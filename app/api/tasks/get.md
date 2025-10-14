# Tasks API Documentation

## GET /api/tasks

Retrieve tasks with advanced filtering, sorting, pagination, and relation loading capabilities. All requests require authentication.

---

## Authentication

**Required:** Session token via Supabase authentication

**Error Response (401):**
```json
{
  "status": 401,
  "code": "unauthorized",
  "message": "Invalid session, login required"
}
```

---

## Request Parameters

### Query Parameters

#### Identification & Basic Filters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `id` | string | Filter by task ID (exact match) | `279a0f70-db9b-4347-9566-e66bdbfb0519` |
| `name` | string | Filter by task name (case-insensitive, partial match) | `meeting` |
| `projectId` | string | Filter by project ID | `51f76460-f644-4a0a-801d-ca4d0d99f00b` |
| `parentTask` | string | Filter by parent task ID | `946e7533-f686-4f93-981e-88cacbe06bf5` |
| `taskPriority` | string | Filter by priority level | `high`, `medium`, `low`,`urgent` |
| `taskStatus` | string | Filter by status | `pending`, `on_process`, `archived` |
| `hideSubtask` | `"true"` | Filter tasks without `parentTask` id if provided with `"true"` | `true`

#### Pagination

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `limit` | number | 20 | 100 | Number of results per page |
| `offset` | number | 0 | — | Number of results to skip |

#### Sorting

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `orderBy` | string | `createdAt` | Sort field: `name`, `createdAt`, `completedAt`, `deadlineAt`, `reminderAt`|
| `orderDirection` | string | `desc` | Sort order: `asc` or `desc` |

#### Status Filters

| Parameter | Type | Description | Note |
|-----------|------|-------------|------|
| `isCompleted` | `"true"` | Fetch only completed tasks | Excludes incomplete tasks by default |
| `isOverdue` | `"true"` | Fetch overdue tasks | Only applies when `isCompleted` is not `true` |
| `isSoon` | number | Fetch tasks due within milliseconds | E.g., `900000` = 15 minutes from now |
| `isTomorrow` | `"true"` | Fetch tasks due tomorrow | Ignored if `isSoon` or `isCompleted` is set |

#### Date Range Filtering

| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | string | Date field to filter: `createdAt`, `completedAt`, `deadlineAt`, `reminderAt` |
| `from` | ISO 8601 string | Start of date range (inclusive) |
| `to` | ISO 8601 string | End of date range (inclusive) |

**Note:** All three parameters (`date`, `from`, `to`) must be provided for date range filtering to apply.

#### Relations

| Parameter | Type | Description | Format |
|-----------|------|-------------|--------|
| `include` | string | Relations to include in response | Comma-separated values |

**Available Relations:**
- `owner` — Include task owner information
- `project` — Include project details
- `masterTask` — Include master task (if applicable)
- `parent` — Include parent task (supports depth, e.g., `parent-2`)
- `subtasks` — Include subtasks (supports depth, e.g., `subtasks-3`)

**Depth:**
Supports depth for fetching nested relations like _parent_ and _subtasks_.

```
[relation]-[depth]
```

<br>

**Depth Relations:**
Supports joining relations for nested relation with `>`

```
[relation]>[relation]
```



---
<br>

**Examples:**

Include owner, project and subtasks (1 level deep)
```
include=owner,project,subtasks
```

<br>
Fetch subtasks (2 levels deep)

```
include=subtasks-2
```

<br>
Fetch subtasks (2 levels deep) along with its parents

```
include=subtasks-2, subtask>parent
```

<br>
Fetch tasks with parent's subtasks (2 levels deep)

```
include=parent-2, parent>subtasks-2
```

_note that parent is singular while subtasks is plural_ as parent will return an `object` while subtasks will return an `array` as a list of `tasks`


---

## Response

### Success Response (200)

```json
{
  "status": 200,
  "code": "success_fetched_tasks",
  "message": "Tasks found and fetched",
  "result": {
    "data": [
      {
        "id": "task-123",
        "name": "Complete project proposal",
        "description": "Write and submit Q4 proposal",
        "taskPriority": "high",
        "taskStatus": "on_process",
        "createdAt": "2025-01-15T10:30:00Z",
        "deadlineAt": "2025-01-20T17:00:00Z",
        "completedAt": null,
        "reminderAt": "2025-01-20T09:00:00Z",
        "projectId": "proj-456",
        "ownerId": "user-789",
        "parentTask": null,
        "owner": {
          "id": "user-789",
          "email": "user@example.com",
          "name": "John Doe"
        },
        "project": {
          "id": "proj-456",
          "name": "Q4 Planning"
        },
        "parent": null,
        "subtasks": [
          {
            "id": "task-124",
            "name": "Review team feedback",
            "taskStatus": "pending"
          }
        ]
      }
    ],
    "pagination": {
      "limit": 20,
      "offset": 0,
      "total": 45,
      "hasMore":true
    },
    "sorting": {
      "orderBy": "deadlineAt",
      "orderDirection": "asc"
    }
  }
}
```

### Not Found Response (404)

```json
{
  "status": 404,
  "code": "not_found",
  "message": "No tasks is found",
  "result": {
    "data": [],
    "pagination": {
      "limit": 20,
      "offset": 0,
      "total": 0
    },
    "sorting": {
      "orderBy": "createdAt",
      "orderDirection": "desc"
    }
  }
}
```

### Error Response (500)

```json
{
  "status": 500,
  "code": "database_error",
  "message": "Failed when fetching tasks",
  "result": null
}
```

---

# Usage Examples

## Basic Request
Fetch first 20 tasks, sorted by creation date (newest first):

```
GET /api/tasks
```

<br>

## Fetch Incomplete Tasks Due Soon
Fetch tasks due within 15 minutes:

```
GET /api/tasks?isSoon=900000&limit=10
```

<br>

## Filter by Project with Relations
Fetch tasks in a specific project, including owner and subtasks:

```
GET /api/tasks?projectId=proj-456&include=owner,subtasks&limit=50
```

<br>

## Search and Sort
Search for tasks by name, sorted by deadline ascending:

```
GET /api/tasks?name=review&orderBy=deadlineAt&orderDirection=asc
```

<br>

## Date Range Filter
Fetch tasks created between specific dates:

```
GET /api/tasks?date=createdAt&from=2025-01-01T00:00:00Z&to=2025-01-31T23:59:59Z
```

<br>

### Overdue Tasks with Recursive Relations
Fetch overdue tasks with parent hierarchy and nested subtasks:

```
GET /api/tasks?isOverdue=true&include=parent-3,subtasks-2
```

<br>

## Completed Tasks with Pagination
Fetch page 2 of completed tasks (50 per page), sorted by completion date:

```
GET /api/tasks?isCompleted=true&limit=50&offset=50&orderBy=completedAt&orderDirection=desc
```

<br>

## Complex Query
Fetch high-priority incomplete tasks due tomorrow with full relations:

```
GET /api/tasks?taskPriority=high&isTomorrow=true&include=owner,project,parent-2,subtasks-2
```

---

## Filter Logic & Constraints

### Status Filters (Mutually Exclusive Behavior)

- **Default**: Returns only incomplete tasks (`isCompleted` is implicit `false`)
- **isCompleted=true**: Overrides default, returns only completed tasks
- **isOverdue=true**: Only applies when `isCompleted` is NOT `true`
- **isSoon**: Only applies when `isCompleted` is NOT `true`
- **isTomorrow**: Ignored if `isSoon` or `isCompleted` is set

### Date Range Filtering

- Requires all three parameters: `date`, `from`, and `to`
- Valid date fields: `createdAt`, `completedAt`, `deadlineAt`, `reminderAt`
- Dates are compared inclusively (both endpoints included)

### Sorting

- Valid fields: `name`, `createdAt`, `completedAt`, `deadlineAt`
- Default: `createdAt` descending (newest first)
- Invalid fields are silently ignored and replaced with default

### Pagination

- Minimum limit: 1
- Maximum limit: 100
- Offset cannot be negative

---

## Recurrences
Not yet implemented, as of right now include for nested parent is not supporting `masterTask` as limitation might be introduce to prevent recurring tasks to have subtasks.



---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `unauthorized` | 401 | Session invalid or expired, login required |
| `database_error` | 500 | Database query failed |
| `unknown_error` | 500 | Unexpected server error |
| `bad_request` | 400 | Invalid parameter value |
| `not_found` | 404 | No tasks match the query |

---

## Rate Limiting

No explicit rate limiting documented. Follow your API gateway's rate limiting policies.

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Task owner is always used as filter (tasks are scoped to authenticated user)
- Partial text searches use case-insensitive pattern matching
- Relations are loaded recursively based on specified depth
- Empty results return 404 status with empty data array
- Server logs all errors for debugging purposes