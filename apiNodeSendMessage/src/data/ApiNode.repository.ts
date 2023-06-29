import { ApiNode } from '../models/ApiNode.models';

export class ApiNodeRepository {
    async cadastrarApiNode(apiNode: ApiNode | null){
        return apiNode;
    }
}