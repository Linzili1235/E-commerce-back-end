export interface IdCheckRes {
    index: number
    entities: any[]
}

export class CheckController {
    public static async checkIdExists(ids: any[], repo: any): Promise<IdCheckRes> {
        let entities = []
        let index = 0
        let res: IdCheckRes = {
            index: -1,
            entities
        }
        console.log('in check-controller', ids.length)
        for (index = 0; index < ids.length; index++) {
            try {
                let entry = await repo.findOneOrFail({
                    where: {
                        id: ids[index]
                    }
                })
                console.log('entry', entry)
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