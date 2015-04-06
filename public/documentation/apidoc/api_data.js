define({ "api": [
  {
    "type": "post",
    "url": "/entity",
    "title": "Create a new entity",
    "name": "Create_Entity",
    "group": "Entity",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityExistsError",
            "description": "<p>User trying to create an entity with a name that already exists.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "entityList",
            "description": "<p>Array containing zero or more entity objects.</p> "
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "entityList.active",
            "description": "<p>Indicates whether or not the entity is active.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityList.name",
            "description": "<p>Name of the entity.</p> "
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "entityList.properties",
            "description": "<p>Properties of the entity.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.name",
            "description": "<p>Name of the property.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.value",
            "description": "<p>Default value of the property.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.type",
            "description": "<p>Data type of the property.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n   {\n       \"active\": true,\n       \"instanceClassName\": \"jet5505ed96c31d628c5f4a76f5\",\n       \"name\": \"jet\",\n       \"accountId\": \"5505ed96c31d628c5f4a76f5\",\n       \"_id\": \"5505ede9c31d628c5f4a76fd\",\n       \"__v\": 0,\n       \"properties\": [\n           {\n               \"name\": \"wings\",\n               \"value\": \"\",\n               \"type\": \"number\",\n               \"_id\": \"5505ede9c31d628c5f4a76fe\"\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Entity"
  },
  {
    "type": "delete",
    "url": "/entity/:id",
    "title": "Delete a specific entity by it's ID.",
    "name": "Delete_entity_by_ID_",
    "group": "Entity",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityExistsError",
            "description": "<p>User trying to create an entity with a name that already exists.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Index (id) of entity to delete.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the delete operation (OK/ERROR).</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Human readable description of the status.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n    \"status\": \"OK\",\n    \"description\": \"Entity deleted.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Entity"
  },
  {
    "type": "get",
    "url": "/entity",
    "title": "Get all entities",
    "name": "Get_Entities",
    "group": "Entity",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "entityList",
            "description": "<p>Array containing zero or more entity objects.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "entityList.active",
            "description": "<p>Indicates whether or not the entity is active.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.instanceClassName",
            "description": "<p>Internal reference to instance. To be used for bug tracking or debugging.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.name",
            "description": "<p>Name of the entity.</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "entityList.accountId",
            "description": "<p>Id of the account the entity belongs to.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList._id",
            "description": "<p>Entity index.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "entityList.properties",
            "description": "<p>Properties of the entity.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.name",
            "description": "<p>Name of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.value",
            "description": "<p>Default value of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.properties.type",
            "description": "<p>Data type of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "entityList.properties._id",
            "description": "<p>Property index.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n        \"entityList\": [\n            {\n                \"active\": true,\n                \"instanceClassName\": \"jet5505ed96c31d628c5f4a76f5\",\n                \"name\": \"jet\",\n                \"accountId\": \"5505ed96c31d628c5f4a76f5\",\n                \"_id\": \"5505ede9c31d628c5f4a76fd\",\n                \"__v\": 0,\n                \"properties\": [\n                    {\n                        \"name\": \"wings\",\n                        \"value\": \"\",\n                        \"type\": \"number\",\n                        \"_id\": \"5505ede9c31d628c5f4a76fe\"\n                    }\n                ]\n            },\n            {\n                \"active\": true,\n                \"instanceClassName\": \"stocklib5505ed96c31d628c5f4a76f5\",\n                \"name\": \"stocklib\",\n                \"accountId\": \"5505ed96c31d628c5f4a76f5\",\n                \"_id\": \"550ef91fd280172590625f27\",\n                \"__v\": 0,\n                \"properties\": [\n                    {\n                        \"name\": \"itemName\",\n                        \"value\": \"\",\n                        \"type\": \"string\",\n                        \"_id\": \"550ef91fd280172590625f2a\"\n                    },\n                    {\n                        \"name\": \"stockDate\",\n                        \"value\": \"\",\n                        \"type\": \"date\",\n                        \"required\": true,\n                        \"_id\": \"550ef91fd280172590625f29\"\n                    },\n                    {\n                        \"name\": \"itemCount\",\n                        \"value\": \"\",\n                        \"type\": \"number\",\n                        \"required\": true,\n                        \"_id\": \"550ef91fd280172590625f28\"\n                    }\n                ]\n            }\n        ]\n    }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Entity"
  },
  {
    "type": "get",
    "url": "/entity/:id",
    "title": "Get a specific entity by it's ID.",
    "name": "Get_entity_by_ID_",
    "group": "Entity",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityExistsError",
            "description": "<p>User trying to create an entity with a name that already exists.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityNotFoundError",
            "description": "<p>API factory cannot find specified entity.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Index (id) of entity to get.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "active",
            "description": "<p>Indicates whether or not the entity is active.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "instanceClassName",
            "description": "<p>Internal reference to instance. To be used for bug tracking or debugging.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the entity.</p> "
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "accountId",
            "description": "<p>Id of the account the entity belongs to.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Entity index.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "properties",
            "description": "<p>Properties of the entity.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "properties.name",
            "description": "<p>Name of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "properties.value",
            "description": "<p>Default value of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "properties.type",
            "description": "<p>Data type of the property.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "properties._id",
            "description": "<p>Property index.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n   {\n       \"active\": true,\n       \"instanceClassName\": \"jet5505ed96c31d628c5f4a76f5\",\n       \"name\": \"jet\",\n       \"accountId\": \"5505ed96c31d628c5f4a76f5\",\n       \"_id\": \"5505ede9c31d628c5f4a76fd\",\n       \"__v\": 0,\n       \"properties\": [\n           {\n               \"name\": \"wings\",\n               \"value\": \"\",\n               \"type\": \"number\",\n               \"_id\": \"5505ede9c31d628c5f4a76fe\"\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Entity"
  },
  {
    "type": "post",
    "url": "/instance/:entityName",
    "title": "Create an instance of the specified entity.",
    "name": "Create_instance_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity to create instance of.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>Request object containing additional _id field of your newly created instance.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": " HTTP/1.1 200 OK\n {\n    \"wings\": 200,\n    \"_id\": \"551dd3d42860e830d3fd3754\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "delete",
    "url": "/instance/:entityName/:instanceId",
    "title": "Delete a specific instance of an entity by it's ID.",
    "name": "Delete_instance_by_ID_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InstanceNotFoundError",
            "description": "<p>User trying to list an instance that does not exist.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "instanceId",
            "description": "<p>ID of the instance to delete.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the delete operation (OK/ERROR).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": " HTTP/1.1 200 OK\n {\n    \"status\": \"OK\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "delete",
    "url": "/instance/:entityName/:propertyName/:propertyValue",
    "title": "Delete instances matching a specific property and value.",
    "name": "Delete_instance_by_property_and_value_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InstanceNotFoundError",
            "description": "<p>User trying to list an instance that does not exist.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "propertyName",
            "description": "<p>Name of the property to search. Must be defined in the entity.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "propertyValue",
            "description": "<p>Value of the property.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the delete operation (OK/ERROR).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": " HTTP/1.1 200 OK\n {\n    \"status\": \"OK\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "get",
    "url": "/instance/:entityName",
    "title": "Get all instances for specified entity.",
    "name": "Get_instances_for_an_entity_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity to fetch instances of.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "instanceList",
            "description": "<p>Array containing instance objects. Structure here is defined by properties specified in the entity definition.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n   \"instanceList\": [\n       {\n           \"wings\": 2,\n           \"_id\": \"5505f047187e81286385956b\",\n           \"__v\": 0\n       },\n       {\n           \"wings\": 4,\n           \"_id\": \"5505f04c187e81286385956c\",\n           \"__v\": 0\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "get",
    "url": "/instance/:entityName/:propertyName/:propertyValue",
    "title": "Get all instances for specified entity matching given property and value.",
    "name": "Get_instances_for_an_entity_matching_given_property_and_value_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InstanceNotFoundError",
            "description": "<p>User trying to list an instance that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InvalidPropertyError",
            "description": "<p>User trying to search instances by a property that does not exist.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity to fetch instances of.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "propertyName",
            "description": "<p>Name of the property to search.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "propertyValue",
            "description": "<p>Value of the specified property.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "instanceList",
            "description": "<p>Array containing instance objects. Structure here is defined by properties specified in the entity definition.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n   \"instanceList\": [\n       {\n           \"wings\": 2,\n           \"_id\": \"5505f047187e81286385956b\",\n           \"__v\": 0\n       },\n       {\n           \"wings\": 4,\n           \"_id\": \"5505f04c187e81286385956c\",\n           \"__v\": 0\n       }\n   ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "put",
    "url": "/instance/:entityName",
    "title": "Update a specific instance of an entity.",
    "name": "Update_instance_",
    "group": "Instance",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserNotFoundError",
            "description": "<p>User trying to access API was not found.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "EntityDoesNotExistError",
            "description": "<p>User trying to list instances of an entity that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InstanceNotFoundError",
            "description": "<p>User trying to list an instance that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "InvalidPropertyError",
            "description": "<p>User trying to search instances by a property that does not exist.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "MissingArgumentException",
            "description": "<p>One or more required fields are missing.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "EntityDefinitionListError",
            "description": "<p>API factory has encountered an issue while listing entities.</p> "
          },
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "InstanceUpdateFailedError",
            "description": "<p>Failure was encountered while updating instance.</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "entityName",
            "description": "<p>Name of the entity to update instance of.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>Updated instance object.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": " HTTP/1.1 200 OK\n {\n    \"wings\": 425,\n    \"_id\": \"551dd3d42860e830d3fd3754\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "post",
    "url": "/user",
    "title": "Create user",
    "name": "Create_a_new_user",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the new user.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Temporary password of the new user. Upon first login, this user will be asked for a password reset.</p> "
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "isAdmin",
            "description": "<p>Flag indicating whether or not the user is admin.</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform requested operation.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "UserExistsError",
            "description": "<p>The user that is being created already exists. This happens when the new user that is being created has the same username as an existing user.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "UserSaveError",
            "description": "<p>API factory has encountered an issue while saving user.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>User index.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "accountId",
            "description": "<p>Id of the account the user belongs to.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "hasBeenReset",
            "description": "<p>Indicates whether or not the user&#39;s password is scheduled to be reset.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isAdmin",
            "description": "<p>Indicates if the user is administrator.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isEnabled",
            "description": "<p>Indicates if the user&#39;s account is enabled.</p> "
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "lastLoginDate",
            "description": "<p>Date of the user&#39;s last login.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "roles",
            "description": "<p>List of roles the user is in. Admin users assume all roles by default.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n        \"_id\": \"550eb24ebeebe58583aa9fbc\",\n        \"__v\": 0,\n        \"accountId\": \"550eb24ebeebe58583aa9fba\",\n        \"hasBeenReset\": false,\n        \"isAdmin\": true,\n        \"isEnabled\": true,\n        \"lastLoginDate\": \"2015-04-06T09:47:01.480Z\",\n        \"username\": \"admin\",\n        \"roles\": [ ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user-login.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/user/:userId",
    "title": "Delete user",
    "name": "Delete_a_user_by_Id",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>_id of the user to be deleted.</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform requested operation.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "UserListError",
            "description": "<p>API factory has encountered an issue while listing users.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the operation (OK/ERROR).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n        \"status\": \"OK\"\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user-login.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user",
    "title": "Get all users",
    "name": "Get_all_users",
    "group": "User",
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform requested operation.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "UserListError",
            "description": "<p>API factory has encountered an issue while listing users.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "userList",
            "description": "<p>Array containing one or more user objects.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userList._id",
            "description": "<p>User index.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userList.accountId",
            "description": "<p>Id of the account the user belongs to.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "userList.hasBeenReset",
            "description": "<p>Indicates whether or not the user&#39;s password is scheduled to be reset.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "userList.isAdmin",
            "description": "<p>Indicates if the user is administrator.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "userList.isEnabled",
            "description": "<p>Indicates if the user&#39;s account is enabled.</p> "
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "userList.lastLoginDate",
            "description": "<p>Date of the user&#39;s last login.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userList.username",
            "description": "<p>Username of the user.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "userList.roles",
            "description": "<p>List of roles the user is in. Admin users assume all roles by default.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n        \"userList\": [\n            {\n                \"_id\": \"550eb24ebeebe58583aa9fbc\",\n                \"__v\": 0,\n                \"accountId\": \"550eb24ebeebe58583aa9fba\",\n                \"hasBeenReset\": false,\n                \"isAdmin\": true,\n                \"isEnabled\": true,\n                \"lastLoginDate\": \"2015-04-06T09:20:50.989Z\",\n                \"username\": \"admin\",\n                \"roles\": [ ]\n            },\n            {\n                \"_id\": \"550efb2d9590ca1100de4f43\",\n                \"createdBy\": \"admin\",\n                \"isEnabled\": true,\n                \"isAdmin\": true,\n                \"hasBeenReset\": true,\n                \"username\": \"mrcool\",\n                \"accountId\": \"550eb24ebeebe58583aa9fba\",\n                \"__v\": 0,\n                \"roles\": [ ]\n            },\n            {\n                \"_id\": \"551a8eb10cbe5f1100287eb1\",\n                \"createdBy\": \"admin\",\n                \"isEnabled\": true,\n                \"isAdmin\": true,\n                \"hasBeenReset\": false,\n                \"username\": \"leigh\",\n                \"accountId\": \"550eb24ebeebe58583aa9fba\",\n                \"__v\": 0,\n                \"lastLoginDate\": \"2015-03-31T12:10:57.496Z\",\n                \"roles\": [ ]\n            }\n        ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user-login.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/:userId",
    "title": "Get a specific user by Id.",
    "name": "Get_specific_user_by_Id",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>value of the user to fetch details of.</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "ClientError": [
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "LoginRequired",
            "description": "<p>The user needs to log in.</p> "
          },
          {
            "group": "ClientError",
            "type": "json",
            "optional": false,
            "field": "AccessDeniedError",
            "description": "<p>The user does not have sufficient privileges to perform requested operation.</p> "
          }
        ],
        "ServerError": [
          {
            "group": "ServerError",
            "type": "json",
            "optional": false,
            "field": "UserListError",
            "description": "<p>API factory has encountered an issue while listing users.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>User index.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "accountId",
            "description": "<p>Id of the account the user belongs to.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "hasBeenReset",
            "description": "<p>Indicates whether or not the user&#39;s password is scheduled to be reset.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isAdmin",
            "description": "<p>Indicates if the user is administrator.</p> "
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isEnabled",
            "description": "<p>Indicates if the user&#39;s account is enabled.</p> "
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "lastLoginDate",
            "description": "<p>Date of the user&#39;s last login.</p> "
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user.</p> "
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "roles",
            "description": "<p>List of roles the user is in. Admin users assume all roles by default.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Example response from a successful call:",
          "content": "HTTP/1.1 200 OK\n{\n        \"_id\": \"550eb24ebeebe58583aa9fbc\",\n        \"__v\": 0,\n        \"accountId\": \"550eb24ebeebe58583aa9fba\",\n        \"hasBeenReset\": false,\n        \"isAdmin\": true,\n        \"isEnabled\": true,\n        \"lastLoginDate\": \"2015-04-06T09:47:01.480Z\",\n        \"username\": \"admin\",\n        \"roles\": [ ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user-login.js",
    "groupTitle": "User"
  }
] });