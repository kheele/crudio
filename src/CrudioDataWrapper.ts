import CrudioRepository from "./CrudioRepository";
import CrudioField from "./CrudioField";
import CrudioGQL from "./CrudioGQL";
import CrudioTable from "./CrudioTable";
import { ICrudioConfig } from "./CrudioTypes";

export default class CrudioDataWrapper {
  gql: CrudioGQL;
  config: ICrudioConfig;
  repo: CrudioRepository;

  constructor(config: ICrudioConfig, repo: CrudioRepository) {
    this.config = config;
    this.gql = new CrudioGQL(this.config);
    this.repo = repo;
  }

  public async DropTables() {
    const list = this.repo.tables;
    for (var index = 0; index < list.length; index++) {
      var t: CrudioTable = list[index];
      var sql = `DROP TABLE IF EXISTS "${this.config.schema}"."${t.name}" CASCADE;`;
      await this.gql.ExecuteSQL(sql);
    }
  }

  public async CreateTables() {
    const tables = this.repo.tables;
    var create_foreign_keys = "";

    for (var index = 0; index < tables.length; index++) {
      const table: CrudioTable = tables[index];
      const entity = this.repo.GetEntityDefinition(table.entity);

      const key: CrudioField = entity.GetKey();
      const keyField = `"${key.fieldName}" uuid DEFAULT gen_random_uuid() PRIMARY KEY`;

      var sql_fields_definitions = "";
      var sql_column_names = `"${key.fieldName}"`;
      const insert_fieldnames = [key.fieldName];


      entity.fields.map((f: CrudioField) => {
        if (f.fieldName != key.fieldName) {
          sql_fields_definitions += `, "${f.fieldName}" ${f.GetDatabaseFieldType} `;

          if (f.defaultValue)
            sql_fields_definitions += `DEFAULT "${f.defaultValue} "`;

          sql_column_names += `, "${f.fieldName}"`;
          insert_fieldnames.push(f.fieldName);
        }
      });

      // add foreign keys to insert columns
      entity.relationships.map((r) => {
        sql_column_names += `,"${r.FromColumn}"`;
        sql_fields_definitions += `, "${r.FromColumn}" uuid`;

        insert_fieldnames.push(r.FromColumn);
      });

      // -------------- Build create table statement

      const create_table = `CREATE TABLE "${this.config.schema}"."${table.name}" (${keyField} ${sql_fields_definitions});`;

      var insert_rows = `INSERT INTO "${this.config.schema}"."${table.name}" (${sql_column_names}) VALUES`;
      const rows = table.rows;

      // -------------- Build foreign keys

      entity.relationships.map((r) => {
        const target = tables.filter((t) => t.entity === r.To)[0];

        create_foreign_keys += `
        ALTER TABLE "${this.config.schema}"."${table.name}"
        ADD CONSTRAINT FK_${r.RelationshipName}
        FOREIGN KEY("${r.FromColumn}") 
        REFERENCES "${this.config.schema}"."${target.name}"("${r.ToColumn}");
        `;
      });

      // -------------- Build insert rows

      for (var r = 0; r < rows.length; r++) {
        const entity = rows[r];
        if (!entity) throw new Error("NULL data row");

        var values = "";

        insert_fieldnames.map((i) => {
          var v = entity.values[i];

          if (v && v.values) {
            v = v.values.id;
          }

          values += `${v ? "'" + v + "'" : "NULL"},`;
        });

        values = values.substring(0, values.length - 1);

        insert_rows += `(${values}),`;
      }
      insert_rows = insert_rows.substring(0, insert_rows.length - 1);

      await this.gql.ExecuteSQL(create_table);
      await this.gql.ExecuteSQL(insert_rows);
    }

    if (create_foreign_keys.length > 0)
      await this.gql.ExecuteSQL(create_foreign_keys);
  }
}
