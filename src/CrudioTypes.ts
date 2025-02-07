import CrudioEntityDefinition from "./CrudioEntityDefinition";

/**
 * System configuration
 * @date 7/18/2022 - 1:47:30 PM
 *
 * @export
 * @interface ICrudioConfig
 * @typedef {ICrudioConfig}
 */
export interface ICrudioConfig {
	/**
	 * Secret for admin privileges in Hasura
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	hasuraAdminSecret: string;
	/**
	 * URL of Hasura
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	hasuraEndpoint: string;
	/**
	 * Default database schema to connect with Hasura
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?string}
	 */
	schema: string;
	/**
	 * Default name to use for ID fields
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	idField: string;
	/**
	 * List of read-only fields
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string[]}
	 */
	readonlyFields: string[];
	/**
	 * Delete all tables in the schema and prepare for completely new data
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {boolean}
	 */
	wipe: boolean;

	/**
	 * Name of JSON file describing the data model
	 * @date 7/21/2022 - 1:47:19 PM
	 *
	 * @type {string}
	 */
	datamodel: string;
	/**
	 * Name of a further JSON file to include with the main data model
	 * @date 7/21/2022 - 1:47:19 PM
	 *
	 * @type {string}
	 */
	include: string;
}

/**
 * Defines the data model to be generated
 * @date 7/18/2022 - 1:47:30 PM
 *
 * @export
 * @interface ICrudioSchemaDefinition
 * @typedef {ICrudioSchemaDefinition}
 */
export interface ICrudioSchemaDefinition {
	/**
	 * List of hard code assignments
	 * @date 8/2/2022 - 12:11:48 PM
	 *
	 * @type {string[]}
	 */
	assign: ICrudioAssignment[];

	/**
	 * List of other files to include
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?string[]}
	 */
	include?: string[];
	/**
	 * List of entities defined in the schema
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?CrudioEntityDefinition[]}
	 */
	entities?: CrudioEntityDefinition[];
	/**
	 * List of data generator groups, each group contains multiple generators
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?Record<string, unknown>}
	 */
	generators?: [];
	/**
	 * Reusable field definitions
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?{}}
	 */
	snippets?: {};
	/**
	 * Actions to execute when entities are created
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string[]}
	 */
	triggers?: ICrudioTrigger[];
}

export interface ICrudioAssignment {
	target: string;
	fields: Record<string, unknown>;
}

/**
 * Options that are applied to entity fields
 * @date 7/18/2022 - 1:47:30 PM
 *
 * @export
 * @interface ICrudioFieldOptions
 * @typedef {ICrudioFieldOptions}
 */
export interface ICrudioFieldOptions {
	/**
	 * Indicates field is the primary key
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {boolean}
	 */
	isKey?: boolean;

	/**
	 * Indicates the field is readonly
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?boolean}
	 */
	readonly?: boolean;

	/**
	 * Specifies the default value for the field
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?*}
	 */
	defaultValue?: any;

	/**
	 * Indicates the field is sortable
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?boolean}
	 */
	canSort?: boolean;

	/**
	 * Indicates the field can be filtered
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?boolean}
	 */
	canFilter?: boolean;

	/**
	 * Indicates the field is the default sort key
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?boolean}
	 */
	defaultSort?: boolean;

	/**
	 * The name of the entity definition
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?string}
	 */
	entityName?: string;

	/**
	 * Indicates the field contains sensitive data
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?boolean}
	 */
	sensitiveData?: boolean;

	/**
	 * Indicates the field must have a value
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?boolean}
	 */
	isRequired?: boolean;

	/**
	 * Validation requirements
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?string}
	 */
	validation?: string;

	/**
	 * Indicates the list of choices available for a field
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?string}
	 */
	choices?: string;

	/**
	 * Indicates that multiple choices can be selected
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?boolean}
	 */
	multi_choice?: boolean;

	/**
	 * Lowest allowed value
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?*}
	 */
	range_low?: any;

	/**
	 * Highest allowed value
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?*}
	 */
	range_high?: any;

	/**
	 * Placeholder text for the UI field
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?string}
	 */
	placeholder?: string;

	/**
	 * Help text
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?string}
	 */
	help?: string;

	/**
	 * Data generator to use
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?string}
	 */
	generator?: string;

	/**
	 * Field value has to be unique
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?string}
	 */
	isUnique?: string;
}

/**
 * Field schema definition
 * @date 7/18/2022 - 1:47:30 PM
 *
 * @export
 * @interface ICrudioField
 * @typedef {ICrudioField}
 */
export interface ICrudioField {
	/**
	 * Name of field
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	fieldName: string;
	/**
	 * Data type
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	fieldType: string;
	/**
	 * Default value
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {?*}
	 */
	defaultValue?: any;
	/**
	 * Options for the field
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {ICrudioFieldOptions}
	 */
	fieldOptions?: ICrudioFieldOptions;
}

/**
 * Entity schema
 * @date 7/18/2022 - 1:47:30 PM
 *
 * @export
 * @interface ICrudioEntityDefinition
 * @typedef {ICrudioEntityDefinition}
 */
export interface ICrudioEntityDefinition {
	/**
	 * Name of the schema
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	name: string;
	/**
	 * Name of the data table
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	tableName: string;
	/**
	 * List of field definitions
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {ICrudioField[]}
	 */
	fields: ICrudioField[];
	/**
	 * List of relationships to other entities
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {ISchemaRelationship[]}
	 */
	relationships?: ISchemaRelationship[];

	/**
	 * Number of entities required
	 * @date 7/21/2022 - 1:47:19 PM
	 *
	 * @type {number}
	 */
	count?: number;
	/**
	 * Base entity to inherit fields from
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	inherits?: string;
	/**
	 * If abstract, a table will not be created for the entity
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {boolean}
	 */
	abstract?: boolean;
	/**
	 * Field definition snippets to import
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string[]}
	 */
	snippets?: string[];
}

/**
 * Defines relationships between entities
 * @date 7/18/2022 - 1:47:30 PM
 *
 * @export
 * @interface ISchemaRelationship
 * @typedef {ISchemaRelationship}
 */
export interface ISchemaRelationship {
	/**
	 * Indicates that the foreign key must have a value
	 * @date 7/31/2022 - 8:41:55 AM
	 *
	 * @type {boolean}
	 */
	required: boolean;
	/**
	 * The name of the referencing table
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	from: string;
	/**
	 * Refeferencing columns
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	from_column: string;
	/**
	 * The name of the references table
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	to: string;
	/**
	 * Referenced column
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	to_column: string;

	/**
	 * Relationship name
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	name: string;
	/**
	 * "one" for one to many
	 * "many" for many to many
	 * one to many will be implemented as a forgeign key between a child table and parent
	 * many to many will be implemented through a join table with a foreign key to the related entities
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	type: string;

	/**
	 * Number of sample data rows to insert in a many to many table
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {number}
	 */
	count?: number;

	/**
	 * describe a default relationship formed between two objects, such as all users in an organisation
	 * being assigned a default role of Staff
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {string}
	 */
	default?: string;

	/**
	 * describe a relationship to be formed between two objects where a specific entity instance is to be used
	 * for example, an organisation has one user in the role of CEO. An entity is selected from the organisation.users,
	 * and then assigned the role, by looking up the role with name = CEO
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {ISingularNamedRelationship}
	 */
	singular?: ISingularNamedRelationship;

	/**
	 * specify additional fields for many to many join table
	 * @date 7/18/2022 - 1:47:30 PM
	 *
	 * @type {Record<string, unknown>[]}
	 */
	fields?: Record<string, unknown>[];
}

/**
 * Describes an instruction to connect child entities
 * @date 7/18/2022 - 1:47:30 PM
 *
 * @export
 * @interface ICrudioConfig
 * @typedef {ISingularNamedRelationship}
 */

interface ISingularNamedRelationship {
	/**
	 * @date 7/25/2022 - 10:45:41 AM
	 *
	 * @type {string}
	 */
	enumerate: string;
	/**
	 * The field to use as the lookup to acquire a related entity
	 * @date 7/25/2022 - 10:45:41 AM
	 *
	 * @type {string}
	 */
	field: string;
	/**
	 * The values which are used to identify the actual related entities
	 * For example, "HEAD OF IT;HEAD OF HR;HEAD OF SALES", identifying a list where only one user is to be assigned to the role
	 * @date 7/25/2022 - 10:45:41 AM
	 *
	 * @type {string}
	 */
	values: string;
}

/**
 * Instructions to execute each time a specific entity type is created
 * @date 8/2/2022 - 12:11:48 PM
 *
 * @export
 * @interface ICrudioTrigger
 * @typedef {ICrudioTrigger}
 */
export interface ICrudioTrigger {
	/**
	 * Name of the entity definition
	 * @date 8/2/2022 - 12:11:48 PM
	 *
	 * @type {string}
	 */
	entity: string;
	/**
	 * Instructions to execute
	 * @date 8/2/2022 - 12:11:48 PM
	 *
	 * @type {string[]}
	 */
	scripts: string[];
}

/**
 * Definition of a data generator
 * @date 8/2/2022 - 12:11:48 PM
 *
 * @export
 * @interface ICrudioGenerator
 * @typedef {ICrudioGenerator}
 */
export interface ICrudioGenerator {
	/**
	 * Name of the generator
	 * @date 8/2/2022 - 12:11:48 PM
	 *
	 * @type {string}
	 */
	name: string;
	/**
	 * Configuration of how to build a data value
	 * @date 8/2/2022 - 12:11:48 PM
	 *
	 * @type {string}
	 */
	values: string;
}
