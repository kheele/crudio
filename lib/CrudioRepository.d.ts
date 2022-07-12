import { ICrudioSchemaDefinition } from "./CrudioTypes";
import CrudioEntityType from "./CrudioEntityType";
import CrudioEntityInstance from "./CrudioEntityInstance";
import CrudioEntityRelationship from "./CrudioEntityRelationship";
import CrudioTable from "./CrudioTable";
export default class CrudioRepository {
    generators: Record<string, unknown>;
    tables: CrudioTable[];
    entities: CrudioEntityType[];
    relationships: CrudioEntityRelationship[];
    private entityId;
    getEntityId(): number;
    constructor(repo: ICrudioSchemaDefinition);
    private static SetPrototypes;
    private ProcessIncludes;
    private Merge;
    private LoadEntities;
    private CreateEntity;
    private InheritBaseFields;
    private LoadRelationships;
    GetEntityDefinition(entityName: string, failIfNotFound?: boolean): CrudioEntityType | null;
    private CreateEntityType;
    private CreateDataTables;
    private ConnectRelationships;
    private JoinOneToMany;
    GetTable(name: string): CrudioTable;
    GetTableForEntity(name: string): CrudioTable;
    static FromJson(filename: string): CrudioRepository;
    static LoadJson(filename: string): any;
    static FromString(input: string): CrudioRepository;
    ToString(): string;
    Save(filename: string): void;
    private SetTableRecordCount;
    private FillDataTables;
    private DropData;
    FillTable(table: CrudioTable): void;
    GetAllRows(tableName: string): CrudioEntityInstance[];
    GetRowByID(rows: CrudioEntityInstance[], id: number): CrudioEntityInstance | null;
    GetClassName(input: string): string;
    GetFieldType(fieldType: any): string;
    private CreateEntityInstance;
    private ReplaceTokens;
    private GetGeneratedValue;
    private GetRandomNumber;
}