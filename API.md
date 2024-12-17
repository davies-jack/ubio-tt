# ubiotest (1.0.2)



## GET /metrics
(internal) Get current process metrics


### Responses
#### Status: 200
Prometheus metrics in text-based format
- contentType: text/plain
- body: {}


## GET /
Fetches all groups in the database and their instances.


### Responses
#### Status: 200
An array of objects, each containing information about a group.
- contentType: application/json
- body: object
  - group: string
  - instances: number
  - createdAt: number
  - updatedAt: number


## POST /{group}/{id}
Registers a new instance, or updates the hearbeat on an existing one.


### Body Params
- meta: object
- id: string
- group: string


### Responses
#### Status: 200
Instance heartbeat has been updated
- contentType: application/json
- body: object
  - id: string
  - group: string
  - createdAt: number
  - updatedAt: number
  - meta: object(optional)
#### Status: 201
New instance has been registered
- contentType: application/json
- body: object
  - id: string
  - group: string
  - createdAt: number
  - updatedAt: number
  - meta: object(optional)
#### Status: 400
Instance could not be registered due to an error
- contentType: application/json
- body: {}


## DELETE /{group}/{id}
Deletes an instance


### Body Params
- id: string
- group: string


### Responses
#### Status: 200
Instance deleted
- contentType: application/json
- body: object
  - message: string
#### Status: 404
Instance not found
- contentType: application/json
- body: object
  - error: string


## GET /{group}
Fetches all instances in a group


### Body Params
- group: string


### Responses
#### Status: 200
An array of objects, each containing information about an instance.
- contentType: application/json
- body: array
  - items: object
    - id: string
    - group: string
    - createdAt: number
    - updatedAt: number
    - meta: object(optional)