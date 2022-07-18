import { ICrudioFieldOptions } from "./CrudioTypes";

import CrudioField from "./CrudioField";
import CrudioEntityInstance from "./CrudioEntityInstance";
import CrudioEntityRelationship from "./CrudioEntityRelationship";
import CrudioUtils from "./CrudioUtils";

export default class CrudioEntityType {
	public name: string;
	public abstract: boolean;
	public tableAlias: string = "";
	public tableName: string;
	public fields: CrudioField[] = [];
	public relationships: CrudioEntityRelationship[] = [];
	public editor: string = "none";
	public icon: string = "none";
	public caption: string = "none";
	public max_row_count: number = 50;
	public snippets?: string[] = [];

	private unique_keys_values = {};

	public get OneToManyRelationships(): CrudioEntityRelationship[] {
		return this.relationships.filter(r => r.RelationshipType.toLowerCase() === "one");
	}

	public get ManyToManyRelationships(): CrudioEntityRelationship[] {
		return this.relationships.filter(r => r.RelationshipType.toLowerCase() === "many");
	}

	constructor(name: string, table: string | null = null) {
		if (!table) table = CrudioUtils.Plural(name);

		this.name = name;
		this.tableName = table;
	}

	public get UniqueFields(): CrudioField[] {
		const fields: CrudioField[] = [];

		this.fields.map(f => {
			if (f.fieldOptions.isUnique) {
				fields.push(f);
			}
		});

		return fields;
	}

	InitialiseUniqueKeyValues() {
		this.UniqueFields.map(f => {
			this.unique_keys_values[f.fieldName] = [];
		});
	}

	HasUniqueValue(field_name: string, value: string): boolean {
		return this.unique_keys_values[field_name].indexOf(value) >= 0;
	}

	AddUniqueValue(field_name: string, value: string) {
		this.unique_keys_values[field_name].push(value);
	}

	public get KeyField(): CrudioField | null {
		var fields: CrudioField[] = this.fields.filter(f => f.fieldOptions.isKey);
		return fields.length > 0 ? fields[0] : null;
	}

	public SetAlias(alias: string): CrudioEntityType {
		this.tableAlias = alias ?? this.name;
		return this;
	}

	public GetField(fieldName: string, failIfNotFound?: boolean): CrudioField {
		var fields: CrudioField[] = this.fields.filter(f => f.fieldName === fieldName);

		if (fields.length > 1) {
			throw new Error("'" + fieldName + "' matches multiple fields on entity '" + this.name + "'");
		}

		if (failIfNotFound && fields.length !== 1) {
			throw new Error("'" + fieldName + "' is not a valid data field on entity '" + this.name + "'");
		}

		return fields[0];
	}

	AddKey(fieldName: string, fieldType?: string): CrudioEntityType {
		if (this.KeyField !== null) {
			throw new Error("a key field is already defined on entity '" + this.name + "'");
		}

		if (this.GetField(fieldName)) {
			throw new Error("'" + fieldName + "' is already defined on entity '" + this.name + "'");
		}

		var keyField: CrudioField = new CrudioField(fieldName, fieldType || "number", fieldName);
		keyField.fieldOptions.isKey = true;
		keyField.fieldOptions.readonly = true;

		this.fields.push(keyField);

		return this;
	}

	AddString(fieldName: string, caption?: string, options?: ICrudioFieldOptions): CrudioEntityType {
		this.AddField(fieldName, "string", caption, options);

		return this;
	}

	AddNumber(fieldName: string, caption?: string, options?: ICrudioFieldOptions): CrudioEntityType {
		this.AddField(fieldName, "number", caption, options);

		return this;
	}

	AddBoolean(fieldName: string, caption?: string, options?: ICrudioFieldOptions): CrudioEntityType {
		this.AddField(fieldName, "boolean", caption, options);

		return this;
	}

	AddDate(fieldName: string, caption?: string, options?: ICrudioFieldOptions): CrudioEntityType {
		this.AddField(fieldName, "date", caption, options);

		return this;
	}

	AddField(fieldName: string, fieldType: string, caption?: string, options?: ICrudioFieldOptions): CrudioEntityType {
		var field = this.GetField(fieldName);

		if (!field) {
			// If the field does not exist, create it
			field = new CrudioField(fieldName, fieldType, caption, options);
			this.fields.push(field);
		} else {
			// Else allow a type which inherits fields from a base, to override the values of the inherited field
			if (caption) field.caption = caption;
			if (options) field.fieldOptions = options;
		}

		return this;
	}

	AddGraphField(entityName: string, fieldList: string, fieldOptions?: ICrudioFieldOptions): CrudioEntityType {
		if (!fieldOptions) {
			fieldOptions = {
				isKey: false,
			};
		}

		var options: ICrudioFieldOptions = {
			...fieldOptions,
			isKey: fieldOptions.isKey,
			readonly: true,
			entityName: entityName,
			fieldList: fieldList,
		};

		this.fields.push(new CrudioField("Field" + this.fields.length, "string", "Graph Field", options));

		return this;
	}

	AddRelation(rel: CrudioEntityRelationship): CrudioEntityType {
		this.relationships.push(rel);

		return this;
	}

	CreateInstance(values: {}): CrudioEntityInstance {
		return new CrudioEntityInstance(this, values);
	}
}
