export interface IdCheckRes {
    index: number
    entities: any[]
}

export class CheckController {
    public static async checkIdExists(ids: any[], repo: any, idColumnName: string): Promise<IdCheckRes> {
        let entities:any[] = []
        let index = 0
        let res: IdCheckRes = {
            index: -1,
            entities
        }
        for (index = 0; index < ids.length; index++) {
            try {
                let whereClause : any = {};
                whereClause[idColumnName] = ids[index];
                let entry = await repo.findOneOrFail({
                    where: whereClause
                })
                // console.log('entry', entry)
                res.entities.push(entry)
            }catch (e) {
                break
            }
        }

        if (index === ids.length) {
            res.index = -1;
        } else {
            res.index = ids[index]
        }

        return res
    }

}